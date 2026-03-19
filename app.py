import os
from flask import Flask, request, session, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import logging, requests
from bs4 import BeautifulSoup
try:
    import PyPDF2
    PYPDF2_AVAILABLE = True
except Exception:
    PYPDF2_AVAILABLE = False

USE_TRANSFORMER = False
try:
    import importlib
    if importlib.util.find_spec("transformers") is not None and importlib.util.find_spec("torch") is not None:
        from transformers import pipeline
        _transformer = pipeline("summarization", model="t5-base", truncation=True)
        USE_TRANSFORMER = True
except Exception:
    USE_TRANSFORMER = False
try:
    from sumy.parsers.plaintext import PlaintextParser
    from sumy.nlp.tokenizers import Tokenizer
    from sumy.summarizers.lex_rank import LexRankSummarizer
    SUMY_AVAILABLE = True
except Exception:
    SUMY_AVAILABLE = False

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['SECRET_KEY'] = os.environ.get('NEWSLY_SECRET','dev-secret')
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False
import tempfile
tmp_dir = tempfile.gettempdir()
instance_path = os.path.join(tmp_dir, 'instance')
os.makedirs(instance_path, exist_ok=True)
db_path = os.path.join(instance_path, 'newsly_new.db')

# Use 4 slashes for absolute paths on Windows correctly or just standard f-string
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(tmp_dir, 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db = SQLAlchemy(app)
CORS(app, supports_credentials=True, origins=['http://localhost:5173', 'http://127.0.0.1:5173'])

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    def set_password(self,pw): self.password_hash = generate_password_hash(pw)
    def check_password(self,pw): return check_password_hash(self.password_hash,pw)

class Summary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(300))
    original_text = db.Column(db.Text)
    summary_text = db.Column(db.Text)
    method = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()
    if not User.query.filter_by(email='admin@newsly.local').first():
        u = User(email='admin@newsly.local', is_admin=True)
        u.set_password('admin123')
        db.session.add(u); db.session.commit()

def login_required(f):
    from functools import wraps
    @wraps(f)
    def deco(*args, **kwargs):
        if not session.get('user_id'):
            return jsonify({'error': 'Please log in'}), 401
        return f(*args, **kwargs)
    return deco

def admin_required(f):
    from functools import wraps
    @wraps(f)
    def deco(*args, **kwargs):
        uid = session.get('user_id')
        if not uid:
            return jsonify({'error': 'Please log in'}), 401
        u = User.query.get(uid)
        if not u or not u.is_admin:
            return jsonify({'error': 'Admin required'}), 403
        return f(*args, **kwargs)
    return deco

def fetch_text_from_url(url):
    try:
        resp = requests.get(url, timeout=10, headers={'User-Agent':'Mozilla/5.0'})
        soup = BeautifulSoup(resp.text, 'html.parser')
        article = soup.find('article')
        if article:
            return article.get_text(separator='\\n')
        paragraphs = soup.find_all('p')
        return '\\n'.join(p.get_text() for p in paragraphs)
    except Exception as e:
        logger.exception("URL fetch failed: %s", e)
        return ''

def extract_text_from_pdf_file(stream):
    if not PYPDF2_AVAILABLE:
        return ''
    try:
        reader = PyPDF2.PdfReader(stream)
        texts = []
        for p in reader.pages:
            txt = p.extract_text()
            if txt:
                texts.append(txt)
        return '\\n'.join(texts)
    except Exception as e:
        logger.exception("PDF extract failed: %s", e)
        return ''

def _extractive_summarize_offline(text, max_sentences=3):
    import re, math
    from collections import Counter
    if not text or not isinstance(text, str):
        return ""
    sentences = re.split(r'(?<=[.!?])\\s+', text.strip())
    sentences = [s.strip() for s in sentences if s.strip()]
    if len(sentences) <= max_sentences:
        return " ".join(sentences)
    def tokenize(t): return re.findall(r"\\w+", t.lower())
    stopwords = set("a about above after again against all am an and any are as at be because been before being below between both but by could did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself me more most my myself nor of on once only or other our ours ourselves out over own same she should so some such than that their them then there these they this those through to too under until up very was we were what when where which while who whom why with would you your".split())
    freq = Counter()
    for s in sentences:
        for w in tokenize(s):
            if w in stopwords: continue
            freq[w] += 1
    if not freq:
        return " ".join(sentences[:max_sentences])
    maxf = max(freq.values())
    for k in list(freq.keys()):
        freq[k] = freq[k] / maxf
    scored = []
    for i,s in enumerate(sentences):
        score = sum(freq.get(w,0) for w in tokenize(s))
        score = score / (1 + math.log(len(tokenize(s))+1))
        scored.append((i, score, s))
    scored.sort(key=lambda x: x[1], reverse=True)
    top = sorted(scored[:max_sentences], key=lambda x: x[0])
    return " ".join([t[2] for t in top])

def summarize_with_transformer(text, length_choice='medium'):
    try:
        from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
        
        model_name = "t5-base"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

       
        if length_choice == 'short':
            min_length, max_length = 15, 50  # Much stricter!
            length_penalty = 0.5  # PENALIZE longer outputs
            num_beams = 2  # Fewer beams = faster, more concise
        elif length_choice == 'medium':
            min_length, max_length = 60, 120
            length_penalty = 1.0  # Neutral
            num_beams = 4
        else:  # long
            min_length, max_length = 150, 350
            length_penalty = 2.0  # ENCOURAGE longer outputs
            num_beams = 6

        inputs = tokenizer(
            "summarize: " + text,
            return_tensors="pt",
            truncation=True,
            max_length=512  # Reduced for efficiency
        )

        summary_ids = model.generate(
            **inputs,
            num_beams=num_beams,
            min_length=min_length,
            max_length=max_length,
            length_penalty=length_penalty,
            early_stopping=True,
            no_repeat_ngram_size=3,
            repetition_penalty=1.5,  # Prevent repetitive text
            do_sample=False  # Deterministic output
        )

        summary_text = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        return summary_text.strip()

    except Exception as e:
        logger.exception("Transformer summarization failed: %s", e)
        return None


def summarize_text_auto(text, length='medium'):
    s = summarize_with_transformer(text, length_choice=length)
    if s:
        return s, 'transformer'
    if SUMY_AVAILABLE:
        try:
            parser = PlaintextParser.from_string(text, Tokenizer('english'))
            summarizer = LexRankSummarizer()
            sentences_count = 3 if length=='short' else 5 if length=='medium' else 10
            summ_sentences = summarizer(parser.document, sentences_count)
            return ' '.join(str(s) for s in summ_sentences), 'extractive'
        except Exception as e:
            logger.exception("Sumy failed: %s", e)
    sentences_count = 3 if length=='short' else 5 if length=='medium' else 10
    return _extractive_summarize_offline(text, max_sentences=sentences_count), 'extractive'




# ============ API ENDPOINTS FOR REACT FRONTEND ============

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    logger.info(f"Login attempt for email: {email}")
    u = User.query.filter_by(email=email).first()
    if u:
        logger.info(f"User found: {u.email}")
        if u.check_password(password):
            session['user_id'] = u.id
            logger.info(f"Login successful for user_id: {u.id}")
            return jsonify({
                'success': True,
                'user': {'id': u.id, 'email': u.email, 'isAdmin': u.is_admin}
            })
        else:
            logger.info("Password check failed")
    else:
        logger.info("User not found")
    return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

@app.route('/api/signup', methods=['POST'])
def api_signup():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    if not email or not password:
        return jsonify({'success': False, 'error': 'Email and password required'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'error': 'Email already exists'}), 400
    u = User(email=email)
    u.set_password(password)
    db.session.add(u)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/logout')
def api_logout():
    session.clear()
    return jsonify({'success': True})

@app.route('/api/summarize', methods=['POST'])
def api_summarize():
    if not session.get('user_id'):
        return jsonify({'error': 'Please log in'}), 401
    
    text_input = request.form.get('text_input', '').strip()
    url_input = request.form.get('url_input', '').strip()
    length = request.form.get('summary_length', 'medium')
    title = request.form.get('title', 'Untitled')[:250]
    source_text = ''

    if text_input:
        source_text = text_input
    elif url_input:
        source_text = fetch_text_from_url(url_input) or ''
    else:
        f = request.files.get('file_input')
        if f:
            fname = secure_filename(f.filename)
            path = os.path.join(app.config['UPLOAD_FOLDER'], fname)
            f.save(path)
            try:
                with open(path, 'rb') as fh:
                    source_text = extract_text_from_pdf_file(fh)
            except Exception as e:
                logger.exception("Error reading uploaded: %s", e)

    if not source_text or len(source_text.strip()) < 20:
        return jsonify({'error': 'Could not extract enough text'}), 400

    summary, method = summarize_text_auto(source_text, length=length)
    
    s = Summary(
        user_id=session.get('user_id'),
        title=title,
        original_text=source_text[:50000],
        summary_text=summary,
        method=method
    )
    db.session.add(s)
    db.session.commit()

    return jsonify({
        'summary': summary,
        'original_text': source_text,
        'method': method,
        'summary_id': s.id
    })

@app.route('/api/history')
def api_history():
    if not session.get('user_id'):
        return jsonify({'error': 'Please log in'}), 401
    uid = session.get('user_id')
    summaries = Summary.query.filter_by(user_id=uid).order_by(Summary.created_at.desc()).all()
    return jsonify({
        'summaries': [{
            'id': s.id,
            'title': s.title,
            'summary_text': s.summary_text,
            'method': s.method,
            'created_at': s.created_at.isoformat()
        } for s in summaries]
    })

@app.route('/api/summary/<int:sid>', methods=['DELETE'])
def api_delete_summary(sid):
    if not session.get('user_id'):
        return jsonify({'error': 'Please log in'}), 401
    s = Summary.query.get_or_404(sid)
    if s.user_id != session.get('user_id'):
        return jsonify({'error': 'Not authorized'}), 403
    db.session.delete(s)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/me')
def api_me():
    uid = session.get('user_id')
    if not uid:
        return jsonify({'error': 'Not authenticated'}), 401
    u = User.query.get(uid)
    if not u:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({
        'user': {'id': u.id, 'email': u.email, 'isAdmin': u.is_admin}
    })

# ============ FAKE NEWS DETECTOR API ============
@app.route('/api/verify', methods=['POST'])
def api_verify():
    data = request.get_json()
    text = data.get('text', '').strip()
    
    if not text or len(text) < 10:
        return jsonify({'error': 'Please provide more text to analyze'}), 400
    
    # Analyze the text for fake news indicators
    result = analyze_fake_news(text)
    return jsonify(result)

def analyze_fake_news(text):
    import re
    from collections import Counter
    import logging
    logger = logging.getLogger(__name__)
    
    text_lower = text.lower()
    words = re.findall(r'\w+', text_lower)
    
    # Clickbait/sensationalist words
    clickbait_words = ['shocking', 'unbelievable', 'you won\'t believe', 'amazing', 'incredible', 
                       'breaking', 'urgent', 'exclusive', 'secret', 'revealed', 'exposed',
                       'miracle', 'cure', 'guaranteed', 'free', 'limited time', 'act now']
    
    # Credibility indicators
    credible_words = ['according to', 'research shows', 'study finds', 'experts say',
                      'data indicates', 'evidence suggests', 'reported by', 'confirmed']
    
    # Count indicators
    clickbait_count = sum(1 for word in clickbait_words if word in text_lower)
    credible_count = sum(1 for phrase in credible_words if phrase in text_lower)
    
    # Check for excessive punctuation (!!!, ???)
    excessive_punct = len(re.findall(r'[!?]{2,}', text))
    
    # Check for ALL CAPS words
    caps_words = len(re.findall(r'\b[A-Z]{3,}\b', text))
    
    # Calculate base score
    base_score = 65  # lower base score since web check carries weight now
    
    # Adjust score based on indicators
    score = base_score
    score -= clickbait_count * 8
    score += credible_count * 10
    score -= excessive_punct * 5
    score -= caps_words * 3
    
    reasons = []
    
    # Real-world Web Check
    try:
        from duckduckgo_search import DDGS
        
        # Use full text for short queries, otherwise summary
        if len(text) < 100:
            query = text
        else:
            query_words = text.split()[:15]
            query = " ".join(query_words).strip()
            
            if len(query) < 10:
                query = " ".join(sorted(words, key=len, reverse=True)[:5])

        results = list(DDGS().news(query, max_results=3))
        if not results:
            results = list(DDGS().text(query, max_results=3))
        
        fact_check_words = ['fact-check', 'fake', 'hoax', 'false', 'misleading', 'debunked', 'rumor', 'untrue']
        
        is_debunked = False
        corroborated = 0
        news_headlines = []
        
        # Extract important words, aggressively ignoring common ones
        stopwords = {'is','are','am','the','a','an','and','or','but','in','on','at','to','for','with',
                     'of','about','there','their','which','would','could','should','does','do','did',
                     'was','were','has','have','had','been','be','how','what','when','where','why','who'}
                     
        important_words = [w for w in set(words) if len(w) > 4 and w not in stopwords]
        if not important_words:
            important_words = [w for w in set(words) if w not in stopwords]
            
        for r in results:
            snippet = r.get('body', '').lower()
            title = r.get('title', '').lower()
            combined = snippet + " " + title
            
            if r.get('title'):
                news_headlines.append(r.get('title'))
            
            # Check if this result is a fact-check debunking the claim
            if any(fc in combined for fc in fact_check_words):
                is_debunked = True
                break
            
            # Check for corroboration - simple word overlap
            match_count = sum(1 for w in important_words[:20] if w in combined)
            if match_count >= max(1, len(important_words) // 2):
                corroborated += 1
                
        if is_debunked:
            score -= 40
            reasons.append('News appears to be debunked or flagged as false online')
        elif corroborated > 0:
            score += 25
            if news_headlines:
                reasons.append(f'Current reported news: "{news_headlines[0]}"')
            else:
                reasons.append('Found corroborating reports from real-world web search')
        else:
            score -= 20
            reasons.append('Could not find reliable corroborating reports online')
            if len(text) < 100 and news_headlines:
                reasons.append(f'Closest news found: "{news_headlines[0]}"')
    except Exception as e:
        logger.exception(f"Web search verification failed: {e}")
        reasons.append('Unable to cross-reference with real-world news sources')

    # Normalize score
    score = max(10, min(100, score))
    
    # Determine verdict
    if score >= 80:
        verdict = 'Likely Credible'
    elif score >= 60:
        verdict = 'Needs Verification'
    elif score >= 40:
        verdict = 'Potentially Misleading'
    else:
        verdict = 'Likely Fake/Clickbait'
    
    # Generate additional indicator reasons
    if credible_count > 0:
        reasons.append('Contains references to sources or research')
    if clickbait_count > 2:
        reasons.append(f'Contains {clickbait_count} clickbait phrases')
    if excessive_punct > 0:
        reasons.append('Excessive punctuation detected')
    if caps_words > 0:
        reasons.append(f'{caps_words} words in ALL CAPS detected')
    if len(words) > 100:
        reasons.append('Substantial content length')
    
    return {
        'score': score,
        'verdict': verdict,
        'reasons': reasons[:5],
        'indicators': {
            'clickbait_phrases': clickbait_count,
            'credibility_phrases': credible_count,
            'excessive_punctuation': excessive_punct,
            'caps_words': caps_words
        }
    }

# ============ SENTIMENT ANALYZER API ============
@app.route('/api/sentiment', methods=['POST'])
def api_sentiment():
    data = request.get_json()
    text = data.get('text', '').strip()
    
    if not text or len(text) < 10:
        return jsonify({'error': 'Please provide more text to analyze'}), 400
    
    result = analyze_sentiment(text)
    return jsonify(result)

def analyze_sentiment(text):
    import re
    
    text_lower = text.lower()
    words = re.findall(r'\w+', text_lower)
    
    # Emotion word lists
    positive_words = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 
                      'happy', 'joy', 'love', 'best', 'beautiful', 'success', 'win',
                      'hope', 'excited', 'brilliant', 'perfect', 'awesome', 'positive',
                      'improve', 'growth', 'benefit', 'advantage', 'progress', 'achieve']
    
    negative_words = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'sad',
                      'angry', 'fear', 'fail', 'loss', 'problem', 'crisis', 'danger',
                      'threat', 'risk', 'concern', 'worry', 'decline', 'damage', 'harm',
                      'death', 'kill', 'destroy', 'attack', 'war', 'conflict']
    
    trust_words = ['trust', 'reliable', 'honest', 'authentic', 'verified', 'confirmed',
                   'official', 'legitimate', 'credible', 'proven', 'fact', 'evidence']
    
    fear_words = ['fear', 'afraid', 'scared', 'terror', 'panic', 'alarm', 'threat',
                  'danger', 'risk', 'warning', 'emergency', 'crisis']
    
    surprise_words = ['surprise', 'unexpected', 'shocking', 'sudden', 'breaking',
                      'unprecedented', 'remarkable', 'astonishing', 'stunning']
    
    anger_words = ['angry', 'furious', 'outrage', 'rage', 'hate', 'attack', 'blame',
                   'condemn', 'criticize', 'accuse', 'protest', 'demand']
    
    # Count emotions
    word_set = set(words)
    
    joy_score = sum(1 for w in positive_words if w in word_set) * 10
    sadness_score = sum(1 for w in negative_words if w in word_set) * 8
    trust_score = sum(1 for w in trust_words if w in word_set) * 12
    fear_score = sum(1 for w in fear_words if w in word_set) * 10
    surprise_score = sum(1 for w in surprise_words if w in word_set) * 8
    anger_score = sum(1 for w in anger_words if w in word_set) * 10
    
    # Normalize scores (0-100)
    max_possible = max(len(words) * 0.3, 1)
    emotions = {
        'Joy': min(100, int(joy_score / max_possible * 100) + 20),
        'Trust': min(100, int(trust_score / max_possible * 100) + 15),
        'Fear': min(100, int(fear_score / max_possible * 100) + 10),
        'Surprise': min(100, int(surprise_score / max_possible * 100) + 10),
        'Sadness': min(100, int(sadness_score / max_possible * 100) + 10),
        'Anger': min(100, int(anger_score / max_possible * 100) + 5),
    }
    
    # Determine overall sentiment
    positive_total = joy_score + trust_score
    negative_total = sadness_score + fear_score + anger_score
    
    if positive_total > negative_total * 1.5:
        sentiment = 'positive'
        confidence = min(95, 60 + positive_total)
    elif negative_total > positive_total * 1.5:
        sentiment = 'negative'
        confidence = min(95, 60 + negative_total)
    else:
        sentiment = 'neutral'
        confidence = min(90, 70 + abs(positive_total - negative_total))
    
    return {
        'sentiment': sentiment,
        'confidence': confidence,
        'emotions': [{'name': k, 'value': v} for k, v in emotions.items()]
    }

# ============ DAILY BRIEFING API ============
@app.route('/api/briefing')
def api_briefing():
    # Get recent summaries from database as "news"
    summaries = Summary.query.order_by(Summary.created_at.desc()).limit(10).all()
    
    # Also include some curated news items
    curated_news = [
        {
            'id': 'c1',
            'title': 'AI Technology Continues to Transform Industries',
            'summary': 'Artificial intelligence is revolutionizing healthcare, finance, and education sectors with new applications emerging daily.',
            'category': 'Technology',
            'trustScore': 96,
            'sentiment': 'Positive',
            'readTime': '3 min',
            'source': 'Tech Daily',
            'isCurated': True
        },
        {
            'id': 'c2',
            'title': 'Global Climate Summit Reaches New Agreements',
            'summary': 'World leaders commit to ambitious carbon reduction targets in landmark environmental accord.',
            'category': 'Politics',
            'trustScore': 94,
            'sentiment': 'Positive',
            'readTime': '4 min',
            'source': 'World News',
            'isCurated': True
        },
        {
            'id': 'c3',
            'title': 'Stock Markets Show Strong Recovery Signs',
            'summary': 'Major indices reach new highs as economic indicators point to sustained growth.',
            'category': 'Finance',
            'trustScore': 92,
            'sentiment': 'Neutral',
            'readTime': '2 min',
            'source': 'Financial Times',
            'isCurated': True
        },
        {
            'id': 'c4',
            'title': 'Healthcare Innovation Breakthrough Announced',
            'summary': 'New treatment methods show promising results in clinical trials with 90% effectiveness.',
            'category': 'Health',
            'trustScore': 97,
            'sentiment': 'Positive',
            'readTime': '5 min',
            'source': 'Medical Journal',
            'isCurated': True
        },
        {
            'id': 'c5',
            'title': 'Space Exploration Mission Achieves Milestone',
            'summary': 'Latest space mission successfully completes objectives, paving way for future exploration.',
            'category': 'Science',
            'trustScore': 99,
            'sentiment': 'Neutral',
            'readTime': '6 min',
            'source': 'Space Today',
            'isCurated': True
        }
    ]
    
    # Convert user summaries to news format
    user_news = []
    for s in summaries:
        # Analyze sentiment for each summary
        sentiment_result = analyze_sentiment(s.summary_text or '')
        fake_result = analyze_fake_news(s.original_text or s.summary_text or '')
        
        user_news.append({
            'id': f's{s.id}',
            'title': s.title or 'User Summary',
            'summary': (s.summary_text or '')[:200] + '...' if len(s.summary_text or '') > 200 else s.summary_text,
            'category': 'User Content',
            'trustScore': fake_result['score'],
            'sentiment': sentiment_result['sentiment'].capitalize(),
            'readTime': f"{max(1, len((s.summary_text or '').split()) // 200)} min",
            'source': 'Newsly User',
            'isCurated': False,
            'createdAt': s.created_at.isoformat() if s.created_at else None
        })
    
    # Combine and return
    all_news = curated_news + user_news
    
    return jsonify({
        'news': all_news,
        'lastUpdated': datetime.utcnow().isoformat(),
        'totalItems': len(all_news)
    })

# ============ ADMIN API ENDPOINTS ============
@app.route('/api/admin/users', methods=['GET'])
@login_required
def api_admin_users():
    uid = session.get('user_id')
    current_user = User.query.get(uid)
    if not current_user or not current_user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    
    users = User.query.all()
    return jsonify({
        'users': [{
            'id': u.id,
            'email': u.email,
            'is_admin': u.is_admin,
            'created_at': u.created_at.isoformat() if u.created_at else None
        } for u in users]
    })

@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
@login_required
def api_admin_delete_user(user_id):
    uid = session.get('user_id')
    current_user = User.query.get(uid)
    if not current_user or not current_user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    
    user_to_delete = User.query.get_or_404(user_id)
    if user_to_delete.is_admin:
        return jsonify({'error': 'Cannot delete admin users'}), 400
    
    try:
        # Delete user's summaries first
        Summary.query.filter_by(user_id=user_id).delete()
        db.session.delete(user_to_delete)
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        logger.exception("Failed to delete user: %s", e)
        return jsonify({'error': 'Failed to delete user'}), 500

@app.route('/api/admin/users/<int:user_id>', methods=['PUT'])
@login_required
def api_admin_update_user(user_id):
    uid = session.get('user_id')
    current_user = User.query.get(uid)
    if not current_user or not current_user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    
    user_to_update = User.query.get_or_404(user_id)
    data = request.get_json()
    
    if 'email' in data:
        new_email = data['email'].strip().lower()
        if User.query.filter(User.email == new_email, User.id != user_id).first():
            return jsonify({'error': 'Email already exists'}), 400
        user_to_update.email = new_email
    
    try:
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        logger.exception("Failed to update user: %s", e)
        return jsonify({'error': 'Failed to update user'}), 500

@app.route('/api/admin/summaries', methods=['GET'])
@login_required
def api_admin_summaries():
    uid = session.get('user_id')
    current_user = User.query.get(uid)
    if not current_user or not current_user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    
    summaries = Summary.query.order_by(Summary.created_at.desc()).all()
    return jsonify({
        'summaries': [{
            'id': s.id,
            'title': s.title,
            'summary_text': s.summary_text,
            'method': s.method,
            'created_at': s.created_at.isoformat() if s.created_at else None,
            'user_id': s.user_id
        } for s in summaries]
    })

@app.route('/api/admin/stats', methods=['GET'])
@login_required
def api_admin_stats():
    uid = session.get('user_id')
    current_user = User.query.get(uid)
    if not current_user or not current_user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    
    total_users = User.query.count()
    total_summaries = Summary.query.count()
    
    # Today's summaries
    from datetime import datetime, timedelta
    today = datetime.utcnow().date()
    todays_summaries = Summary.query.filter(
        db.func.date(Summary.created_at) == today
    ).count()
    
    # Average summary length
    summaries = Summary.query.all()
    avg_length = 0
    if summaries:
        total_length = sum(len(s.summary_text or '') for s in summaries)
        avg_length = total_length // len(summaries)
    
    return jsonify({
        'total_users': total_users,
        'total_summaries': total_summaries,
        'todays_summaries': todays_summaries,
        'avg_summary_length': avg_length
    })

@app.route('/api/admin/settings', methods=['GET'])
@login_required
def api_admin_get_settings():
    uid = session.get('user_id')
    current_user = User.query.get(uid)
    if not current_user or not current_user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    
    # Return default settings (you can store these in database later)
    settings = {
        'siteName': 'Newsly',
        'siteDescription': 'AI-powered news summarization platform',
        'allowRegistration': True,
        'requireEmailVerification': False,
        'maxSummaryLength': 1000,
        'defaultSummaryMethod': 'transformer',
        'enableNotifications': True,
        'maintenanceMode': False
    }
    
    return jsonify(settings)

@app.route('/api/admin/settings', methods=['POST'])
@login_required
def api_admin_save_settings():
    uid = session.get('user_id')
    current_user = User.query.get(uid)
    if not current_user or not current_user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    
    try:
        settings_data = request.get_json()
        # Here you would save settings to database
        # For now, just return success
        return jsonify({'message': 'Settings saved successfully'})
    except Exception as e:
        return jsonify({'error': 'Failed to save settings'}), 500

if __name__ == '__main__':
    app.run(debug=True)

