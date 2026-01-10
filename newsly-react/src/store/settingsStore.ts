import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  notifications: boolean
  darkMode: boolean
  language: 'en' | 'hi'
  summaryLength: 'short' | 'medium' | 'long'
  autoPlayTTS: boolean
  setNotifications: (value: boolean) => void
  setDarkMode: (value: boolean) => void
  setLanguage: (value: 'en' | 'hi') => void
  setSummaryLength: (value: 'short' | 'medium' | 'long') => void
  setAutoPlayTTS: (value: boolean) => void
  resetSettings: () => void
}

const defaultSettings = {
  notifications: true,
  darkMode: false,
  language: 'en' as const,
  summaryLength: 'medium' as const,
  autoPlayTTS: false,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setNotifications: (value) => set({ notifications: value }),
      setDarkMode: (value) => set({ darkMode: value }),
      setLanguage: (value) => set({ language: value }),
      setSummaryLength: (value) => set({ summaryLength: value }),
      setAutoPlayTTS: (value) => set({ autoPlayTTS: value }),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'newsly-settings',
    }
  )
)

// Comprehensive translations for all pages
export const translations = {
  en: {
    // Common
    home: 'Home',
    about: 'About Us',
    contact: 'Contact Us',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    faq: 'FAQ',
    login: 'Log In',
    signup: 'Sign Up',
    logout: 'Log Out',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Navigation
    tools: 'Tools',
    categories: 'Categories',
    summarize: 'Summarize',
    verify: 'Verify',
    sentiment: 'Sentiment',
    briefing: 'Briefing',
    history: 'History',
    settings: 'Settings',
    more: 'More',
    
    // Home Page
    heroTitle: 'Newsly: The AI News',
    heroSubtitle: 'Super App.',
    heroDescription: 'Summarize, Verify, and Analyze news in seconds.',
    summarizeArticle: 'Summarize Article',
    verifyCredibility: 'Verify Credibility',
    aiPoweredPlatform: 'AI-Powered News Platform',
    aiPowerTools: 'AI Power Tools',
    everythingYouNeed: 'Everything you need to stay informed',
    topRatedStories: "Today's Top Rated Stories",
    whatMakesDifferent: 'What makes Newsly different?',
    readyToSee: 'Ready to see Newsly in action?',
    aiReadsForYou: 'AI that reads for you — anytime, anywhere.',
    summarizeNow: 'Summarize Now',
    
    // Tools
    summarizer: 'Summarizer',
    summarizerDesc: 'Turn long articles into short insights.',
    startReading: 'Start Reading',
    fakeNewsDetector: 'Fake News Detector',
    fakeNewsDesc: 'Check if a headline is clickbait or fact.',
    verifyNow: 'Verify Now',
    emotionAnalyzer: 'Emotion Analyzer',
    emotionDesc: 'See the hidden sentiment behind the text.',
    analyzeTone: 'Analyze Tone',
    dailyBriefing: 'Daily AI Briefing',
    dailyBriefingDesc: 'Top rated news, curated by AI.',
    readFeed: 'Read Feed',
    textToSpeech: 'Text-to-Speech',
    
    // Summarize Page
    pasteArticle: 'Paste your article, URL, or upload a PDF',
    enterText: 'Enter or paste your article text here...',
    enterUrl: 'Enter article URL...',
    uploadPdf: 'Upload PDF',
    dragDrop: 'Drag & drop a PDF here or click to browse',
    generateSummary: 'Generate Summary',
    processing: 'Processing...',
    
    // Result Page
    aiSummary: 'AI Summary',
    originalText: 'Original Text',
    wordsReduced: 'Words Reduced',
    summaryWords: 'Summary Words',
    method: 'Method',
    copyToClipboard: 'Copy to clipboard',
    share: 'Share',
    summarizeAnother: 'Summarize Another',
    viewHistory: 'View History',
    backToSummarize: 'Back to Summarize',
    
    // Verify Page
    verifyTitle: 'Fake News Detector',
    verifySubtitle: 'Check if news is real or fake using AI',
    enterHeadline: 'Enter a news headline or claim to verify...',
    checkCredibility: 'Check Credibility',
    analyzing: 'Analyzing...',
    
    // Sentiment Page
    sentimentTitle: 'Sentiment Analyzer',
    sentimentSubtitle: 'Understand the emotional tone of any text',
    enterTextAnalyze: 'Enter text to analyze sentiment...',
    analyzeSentiment: 'Analyze Sentiment',
    
    // Briefing Page
    briefingTitle: 'Daily AI Briefing',
    briefingSubtitle: "Today's top stories, curated by AI",
    refreshBriefing: 'Refresh Briefing',
    
    // History Page
    historyTitle: 'Your History',
    historySubtitle: 'View your past summarizations',
    noHistory: 'No history yet',
    startSummarizing: 'Start summarizing articles to see them here',
    clearAll: 'Clear All',
    
    // Settings Page
    customize: 'Customize your Newsly experience',
    notifications: 'Notifications',
    notificationsDesc: 'Receive alerts for new features',
    darkMode: 'Dark Mode',
    darkModeDesc: 'Switch to dark theme',
    language: 'Language',
    languageDesc: 'Select your preferred language',
    summaryLength: 'Default Summary Length',
    summaryLengthDesc: 'Choose your preferred summary size',
    short: 'Short',
    medium: 'Medium',
    long: 'Long',
    autoTTS: 'Auto-play Text-to-Speech',
    autoTTSDesc: 'Automatically read summaries aloud',
    privacySettings: 'Privacy & Security',
    privacySettingsDesc: 'Manage your data and privacy',
    deleteAccount: 'Delete Account',
    deleteAccountDesc: 'Permanently delete your account',
    saveSettings: 'Save Settings',
    manage: 'Manage',
    delete: 'Delete',
    english: 'English',
    hindi: 'हिंदी (Hindi)',
    settingsSaved: 'Settings saved successfully!',
    deleteConfirm: 'Are you sure you want to delete your account?',
    accountDeleted: 'Account deleted successfully',
    clearHistory: 'Clear History',
    clearHistoryDesc: 'Delete all your summarization history',
    historyCleared: 'History cleared successfully',
    
    // Auth
    welcomeBack: 'Welcome Back',
    signInContinue: 'Sign in to continue to Newsly',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    createAccount: 'Create Account',
    joinNewsly: 'Join Newsly today',
    fullName: 'Full Name',
    confirmPassword: 'Confirm Password',
    agreeTerms: 'I agree to the Terms of Service and Privacy Policy',
    
    // Contact
    getInTouch: 'Get in Touch',
    contactDesc: 'Have questions? We\'d love to hear from you.',
    yourName: 'Your Name',
    yourEmail: 'Your Email',
    subject: 'Subject',
    message: 'Message',
    sendMessage: 'Send Message',
    
    // About
    aboutTitle: 'About Newsly',
    aboutDesc: 'Your AI-powered news companion',
    ourMission: 'Our Mission',
    ourTeam: 'Our Team',
    
    // Categories
    politics: 'Politics',
    sports: 'Sports',
    technology: 'Technology',
    health: 'Health',
    business: 'Business',
    finance: 'Finance',
    entertainment: 'Entertainment',
    
    // Stats
    newsSummarized: 'News summarized',
    positiveReviews: 'Positive reviews',
    activeUsers: 'Active users',
    
    // Features
    audioNews: 'Audio News',
    audioNewsDesc: 'Articles converted to speech for listening on the go',
    offlineMode: 'Offline Mode',
    offlineModeDesc: 'Works without internet with fallback summarizer',
    flexibleInput: 'Flexible Input',
    flexibleInputDesc: 'Accepts text, URL, or PDF upload',
    productionReady: 'Production Ready',
    productionReadyDesc: 'Scalable and deployment-ready architecture',
    
    // Trust
    trustScore: 'Trust Score',
    verified: 'Verified',
    positive: 'Positive',
    neutral: 'Neutral',
    negative: 'Negative',
    readFullArticle: 'Read Full Article',
    readMore: 'Read More',
    
    // Privacy Page
    privacyTitle: 'Privacy Policy',
    lastUpdated: 'Last updated',
    infoWeCollect: 'Information We Collect',
    infoWeCollectDesc: 'We collect information you provide directly, including email addresses, usage data, and content you submit for summarization.',
    howWeUse: 'How We Use Your Information',
    howWeUseDesc: 'Your information is used to provide and improve our services, personalize your experience, and communicate with you about updates.',
    dataSecurity: 'Data Security',
    dataSecurityDesc: 'We implement industry-standard security measures to protect your data. All transmissions are encrypted using SSL/TLS.',
    yourRights: 'Your Rights',
    yourRightsDesc: 'You have the right to access, correct, or delete your personal data. Contact us at privacy@newsly.com for any requests.',
    contactUs: 'Contact Us',
    contactUsDesc: 'For privacy-related inquiries, please contact us at privacy@newsly.com',
    
    // Terms Page
    termsTitle: 'Terms of Service',
    acceptanceTerms: 'Acceptance of Terms',
    acceptanceTermsDesc: 'By accessing Newsly, you agree to be bound by these Terms of Service and all applicable laws and regulations.',
    useLicense: 'Use License',
    useLicenseDesc: 'Permission is granted to temporarily use Newsly for personal, non-commercial purposes. This license does not include reselling or commercial use of our services.',
    userResponsibilities: 'User Responsibilities',
    userResponsibilitiesDesc: 'You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.',
    disclaimer: 'Disclaimer',
    disclaimerDesc: 'Newsly provides AI-generated summaries and analysis. While we strive for accuracy, we cannot guarantee the completeness or accuracy of all content.',
    termsContact: 'Contact',
    termsContactDesc: 'Questions about the Terms of Service should be sent to legal@newsly.com',
    
    // FAQ Page
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Everything you need to know about Newsly',
    whatIsNewsly: 'What is Newsly?',
    whatIsNewslyAnswer: 'Newsly is an AI-powered news platform that summarizes articles, detects fake news, analyzes sentiment, and provides curated daily briefings.',
    howSummarization: 'How does the summarization work?',
    howSummarizationAnswer: 'We use advanced NLP models including T5 transformers to extract key information and generate concise summaries while preserving the original meaning.',
    isFree: 'Is Newsly free to use?',
    isFreeAnswer: 'Yes! Basic features are free. We offer premium plans for power users who need advanced analytics and unlimited summaries.',
    howAccurate: 'How accurate is the fake news detector?',
    howAccurateAnswer: 'Our AI achieves 95%+ accuracy by analyzing source credibility, cross-referencing facts, and detecting sensationalist language patterns.',
    canUseOffline: 'Can I use Newsly offline?',
    canUseOfflineAnswer: 'Yes! We have a fallback summarizer that works without internet connection, ensuring you can always access core features.',
    
    // More Page
    moreOptions: 'More Options',
    profile: 'Profile',
    
    // Forgot Password
    forgotPasswordTitle: 'Forgot Password?',
    forgotPasswordDesc: 'Enter your email to receive a reset link',
    emailAddress: 'Email Address',
    sendResetLink: 'Send Reset Link',
    sending: 'Sending...',
    checkEmail: 'Check Your Email',
    resetLinkSent: "We've sent a password reset link to",
    didntReceive: "Didn't receive the email? Check your spam folder or",
    tryAgain: 'try again',
    backToLogin: 'Back to Login',
    
    // Text to Speech
    ttsTitle: 'Text-to-Speech',
    ttsSubtitle: 'Convert any text to natural-sounding audio',
    enterTextTTS: 'Enter Text',
    typeOrPaste: 'Type or paste text here to convert to speech...',
    characters: 'characters',
    voice: 'Voice',
    defaultVoice: 'Default Voice',
    speed: 'Speed',
    pitch: 'Pitch',
    play: 'Play',
    pause: 'Pause',
    resume: 'Resume',
    stop: 'Stop',
    speaking: 'Speaking...',
    paused: 'Paused',
    playingAudio: 'Playing audio...',
    
    // Category Page
    categoryNotFound: 'Category Not Found',
    categoryNotFoundDesc: "The category doesn't exist.",
    minRead: 'min read',
    
    // Admin
    dashboard: 'Dashboard',
    articles: 'Articles',
    users: 'Users',
    analytics: 'Analytics',
    
    // Footer
    quickLinks: 'Quick Links',
    followUs: 'Follow Us',
    allRightsReserved: 'All Rights Reserved',
    
    // Settings Privacy
    privacyDesc: 'Manage your data and privacy settings',
  },
  hi: {
    // Common
    home: 'होम',
    about: 'हमारे बारे में',
    contact: 'संपर्क करें',
    privacy: 'गोपनीयता नीति',
    terms: 'सेवा की शर्तें',
    faq: 'अक्सर पूछे जाने वाले प्रश्न',
    login: 'लॉग इन',
    signup: 'साइन अप',
    logout: 'लॉग आउट',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    submit: 'जमा करें',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफल',
    
    // Navigation
    tools: 'उपकरण',
    categories: 'श्रेणियाँ',
    summarize: 'सारांश',
    verify: 'सत्यापित करें',
    sentiment: 'भावना',
    briefing: 'ब्रीफिंग',
    history: 'इतिहास',
    settings: 'सेटिंग्स',
    more: 'और देखें',
    
    // Home Page
    heroTitle: 'Newsly: AI समाचार',
    heroSubtitle: 'सुपर ऐप।',
    heroDescription: 'सेकंडों में समाचार का सारांश, सत्यापन और विश्लेषण करें।',
    summarizeArticle: 'लेख का सारांश',
    verifyCredibility: 'विश्वसनीयता जांचें',
    aiPoweredPlatform: 'AI-संचालित समाचार प्लेटफॉर्म',
    aiPowerTools: 'AI पावर टूल्स',
    everythingYouNeed: 'सूचित रहने के लिए आपको जो कुछ भी चाहिए',
    topRatedStories: 'आज की शीर्ष रेटेड कहानियाँ',
    whatMakesDifferent: 'Newsly को अलग क्या बनाता है?',
    readyToSee: 'Newsly को एक्शन में देखने के लिए तैयार?',
    aiReadsForYou: 'AI जो आपके लिए पढ़ता है — कभी भी, कहीं भी।',
    summarizeNow: 'अभी सारांश करें',
    
    // Tools
    summarizer: 'सारांशकर्ता',
    summarizerDesc: 'लंबे लेखों को छोटी जानकारी में बदलें।',
    startReading: 'पढ़ना शुरू करें',
    fakeNewsDetector: 'फेक न्यूज डिटेक्टर',
    fakeNewsDesc: 'जांचें कि हेडलाइन क्लिकबेट है या तथ्य।',
    verifyNow: 'अभी सत्यापित करें',
    emotionAnalyzer: 'भावना विश्लेषक',
    emotionDesc: 'टेक्स्ट के पीछे छिपी भावना देखें।',
    analyzeTone: 'टोन का विश्लेषण करें',
    dailyBriefing: 'दैनिक AI ब्रीफिंग',
    dailyBriefingDesc: 'AI द्वारा क्यूरेट की गई शीर्ष समाचार।',
    readFeed: 'फीड पढ़ें',
    textToSpeech: 'टेक्स्ट-टू-स्पीच',
    
    // Summarize Page
    pasteArticle: 'अपना लेख, URL पेस्ट करें, या PDF अपलोड करें',
    enterText: 'यहां अपना लेख टेक्स्ट दर्ज करें या पेस्ट करें...',
    enterUrl: 'लेख URL दर्ज करें...',
    uploadPdf: 'PDF अपलोड करें',
    dragDrop: 'यहां PDF ड्रैग और ड्रॉप करें या ब्राउज़ करने के लिए क्लिक करें',
    generateSummary: 'सारांश बनाएं',
    processing: 'प्रोसेसिंग...',
    
    // Result Page
    aiSummary: 'AI सारांश',
    originalText: 'मूल टेक्स्ट',
    wordsReduced: 'शब्द कम हुए',
    summaryWords: 'सारांश शब्द',
    method: 'विधि',
    copyToClipboard: 'क्लिपबोर्ड पर कॉपी करें',
    share: 'शेयर करें',
    summarizeAnother: 'एक और सारांश करें',
    viewHistory: 'इतिहास देखें',
    backToSummarize: 'सारांश पर वापस जाएं',
    
    // Verify Page
    verifyTitle: 'फेक न्यूज डिटेक्टर',
    verifySubtitle: 'AI का उपयोग करके जांचें कि समाचार असली है या नकली',
    enterHeadline: 'सत्यापित करने के लिए समाचार हेडलाइन या दावा दर्ज करें...',
    checkCredibility: 'विश्वसनीयता जांचें',
    analyzing: 'विश्लेषण हो रहा है...',
    
    // Sentiment Page
    sentimentTitle: 'भावना विश्लेषक',
    sentimentSubtitle: 'किसी भी टेक्स्ट के भावनात्मक टोन को समझें',
    enterTextAnalyze: 'भावना का विश्लेषण करने के लिए टेक्स्ट दर्ज करें...',
    analyzeSentiment: 'भावना का विश्लेषण करें',
    
    // Briefing Page
    briefingTitle: 'दैनिक AI ब्रीफिंग',
    briefingSubtitle: 'AI द्वारा क्यूरेट की गई आज की शीर्ष कहानियाँ',
    refreshBriefing: 'ब्रीफिंग रिफ्रेश करें',
    
    // History Page
    historyTitle: 'आपका इतिहास',
    historySubtitle: 'अपने पिछले सारांश देखें',
    noHistory: 'अभी तक कोई इतिहास नहीं',
    startSummarizing: 'यहां देखने के लिए लेखों का सारांश शुरू करें',
    clearAll: 'सभी साफ़ करें',
    
    // Settings Page
    customize: 'अपने Newsly अनुभव को अनुकूलित करें',
    notifications: 'सूचनाएं',
    notificationsDesc: 'नई सुविधाओं के लिए अलर्ट प्राप्त करें',
    darkMode: 'डार्क मोड',
    darkModeDesc: 'डार्क थीम पर स्विच करें',
    language: 'भाषा',
    languageDesc: 'अपनी पसंदीदा भाषा चुनें',
    summaryLength: 'डिफ़ॉल्ट सारांश लंबाई',
    summaryLengthDesc: 'अपना पसंदीदा सारांश आकार चुनें',
    short: 'छोटा',
    medium: 'मध्यम',
    long: 'लंबा',
    autoTTS: 'ऑटो-प्ले टेक्स्ट-टू-स्पीच',
    autoTTSDesc: 'सारांश स्वचालित रूप से पढ़ें',
    privacySettings: 'गोपनीयता और सुरक्षा',
    privacySettingsDesc: 'अपना डेटा और गोपनीयता प्रबंधित करें',
    deleteAccount: 'खाता हटाएं',
    deleteAccountDesc: 'अपना खाता स्थायी रूप से हटाएं',
    saveSettings: 'सेटिंग्स सहेजें',
    manage: 'प्रबंधित करें',
    delete: 'हटाएं',
    english: 'English',
    hindi: 'हिंदी (Hindi)',
    settingsSaved: 'सेटिंग्स सफलतापूर्वक सहेजी गईं!',
    deleteConfirm: 'क्या आप वाकई अपना खाता हटाना चाहते हैं?',
    accountDeleted: 'खाता सफलतापूर्वक हटा दिया गया',
    clearHistory: 'इतिहास साफ़ करें',
    clearHistoryDesc: 'अपना सारा सारांश इतिहास हटाएं',
    historyCleared: 'इतिहास सफलतापूर्वक साफ़ किया गया',
    
    // Auth
    welcomeBack: 'वापसी पर स्वागत है',
    signInContinue: 'Newsly जारी रखने के लिए साइन इन करें',
    email: 'ईमेल',
    password: 'पासवर्ड',
    forgotPassword: 'पासवर्ड भूल गए?',
    noAccount: 'खाता नहीं है?',
    haveAccount: 'पहले से खाता है?',
    createAccount: 'खाता बनाएं',
    joinNewsly: 'आज ही Newsly से जुड़ें',
    fullName: 'पूरा नाम',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    agreeTerms: 'मैं सेवा की शर्तों और गोपनीयता नीति से सहमत हूं',
    
    // Contact
    getInTouch: 'संपर्क में रहें',
    contactDesc: 'कोई सवाल है? हम आपसे सुनना पसंद करेंगे।',
    yourName: 'आपका नाम',
    yourEmail: 'आपका ईमेल',
    subject: 'विषय',
    message: 'संदेश',
    sendMessage: 'संदेश भेजें',
    
    // About
    aboutTitle: 'Newsly के बारे में',
    aboutDesc: 'आपका AI-संचालित समाचार साथी',
    ourMission: 'हमारा मिशन',
    ourTeam: 'हमारी टीम',
    
    // Categories
    politics: 'राजनीति',
    sports: 'खेल',
    technology: 'प्रौद्योगिकी',
    health: 'स्वास्थ्य',
    business: 'व्यापार',
    finance: 'वित्त',
    entertainment: 'मनोरंजन',
    
    // Stats
    newsSummarized: 'समाचार सारांशित',
    positiveReviews: 'सकारात्मक समीक्षाएं',
    activeUsers: 'सक्रिय उपयोगकर्ता',
    
    // Features
    audioNews: 'ऑडियो समाचार',
    audioNewsDesc: 'चलते-फिरते सुनने के लिए लेख स्पीच में बदले गए',
    offlineMode: 'ऑफलाइन मोड',
    offlineModeDesc: 'फॉलबैक सारांशकर्ता के साथ इंटरनेट के बिना काम करता है',
    flexibleInput: 'लचीला इनपुट',
    flexibleInputDesc: 'टेक्स्ट, URL, या PDF अपलोड स्वीकार करता है',
    productionReady: 'प्रोडक्शन रेडी',
    productionReadyDesc: 'स्केलेबल और डिप्लॉयमेंट-रेडी आर्किटेक्चर',
    
    // Trust
    trustScore: 'विश्वास स्कोर',
    verified: 'सत्यापित',
    positive: 'सकारात्मक',
    neutral: 'तटस्थ',
    negative: 'नकारात्मक',
    readFullArticle: 'पूरा लेख पढ़ें',
    readMore: 'और पढ़ें',
    
    // Privacy Page
    privacyTitle: 'गोपनीयता नीति',
    lastUpdated: 'अंतिम अपडेट',
    infoWeCollect: 'हम कौन सी जानकारी एकत्र करते हैं',
    infoWeCollectDesc: 'हम आपके द्वारा सीधे प्रदान की गई जानकारी एकत्र करते हैं, जिसमें ईमेल पते, उपयोग डेटा और सारांश के लिए सबमिट की गई सामग्री शामिल है।',
    howWeUse: 'हम आपकी जानकारी का उपयोग कैसे करते हैं',
    howWeUseDesc: 'आपकी जानकारी का उपयोग हमारी सेवाओं को प्रदान करने और सुधारने, आपके अनुभव को व्यक्तिगत बनाने और अपडेट के बारे में आपसे संवाद करने के लिए किया जाता है।',
    dataSecurity: 'डेटा सुरक्षा',
    dataSecurityDesc: 'हम आपके डेटा की सुरक्षा के लिए उद्योग-मानक सुरक्षा उपाय लागू करते हैं। सभी ट्रांसमिशन SSL/TLS का उपयोग करके एन्क्रिप्ट किए जाते हैं।',
    yourRights: 'आपके अधिकार',
    yourRightsDesc: 'आपको अपने व्यक्तिगत डेटा तक पहुंचने, सुधारने या हटाने का अधिकार है। किसी भी अनुरोध के लिए privacy@newsly.com पर संपर्क करें।',
    contactUs: 'संपर्क करें',
    contactUsDesc: 'गोपनीयता संबंधी पूछताछ के लिए, कृपया privacy@newsly.com पर संपर्क करें',
    
    // Terms Page
    termsTitle: 'सेवा की शर्तें',
    acceptanceTerms: 'शर्तों की स्वीकृति',
    acceptanceTermsDesc: 'Newsly तक पहुंचकर, आप इन सेवा की शर्तों और सभी लागू कानूनों और विनियमों से बंधे होने के लिए सहमत हैं।',
    useLicense: 'उपयोग लाइसेंस',
    useLicenseDesc: 'व्यक्तिगत, गैर-व्यावसायिक उद्देश्यों के लिए अस्थायी रूप से Newsly का उपयोग करने की अनुमति दी गई है। इस लाइसेंस में हमारी सेवाओं का पुनर्विक्रय या व्यावसायिक उपयोग शामिल नहीं है।',
    userResponsibilities: 'उपयोगकर्ता की जिम्मेदारियां',
    userResponsibilitiesDesc: 'आप अपने खाते की गोपनीयता बनाए रखने और अपने खाते के तहत होने वाली सभी गतिविधियों के लिए जिम्मेदार हैं।',
    disclaimer: 'अस्वीकरण',
    disclaimerDesc: 'Newsly AI-जनित सारांश और विश्लेषण प्रदान करता है। जबकि हम सटीकता के लिए प्रयास करते हैं, हम सभी सामग्री की पूर्णता या सटीकता की गारंटी नहीं दे सकते।',
    termsContact: 'संपर्क',
    termsContactDesc: 'सेवा की शर्तों के बारे में प्रश्न legal@newsly.com पर भेजे जाने चाहिए',
    
    // FAQ Page
    faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
    faqSubtitle: 'Newsly के बारे में आपको जो कुछ भी जानना चाहिए',
    whatIsNewsly: 'Newsly क्या है?',
    whatIsNewslyAnswer: 'Newsly एक AI-संचालित समाचार प्लेटफॉर्म है जो लेखों का सारांश देता है, फेक न्यूज का पता लगाता है, भावना का विश्लेषण करता है, और क्यूरेटेड दैनिक ब्रीफिंग प्रदान करता है।',
    howSummarization: 'सारांश कैसे काम करता है?',
    howSummarizationAnswer: 'हम मूल अर्थ को संरक्षित करते हुए मुख्य जानकारी निकालने और संक्षिप्त सारांश उत्पन्न करने के लिए T5 ट्रांसफॉर्मर सहित उन्नत NLP मॉडल का उपयोग करते हैं।',
    isFree: 'क्या Newsly मुफ्त है?',
    isFreeAnswer: 'हां! बुनियादी सुविधाएं मुफ्त हैं। हम उन पावर उपयोगकर्ताओं के लिए प्रीमियम प्लान प्रदान करते हैं जिन्हें उन्नत एनालिटिक्स और असीमित सारांश की आवश्यकता है।',
    howAccurate: 'फेक न्यूज डिटेक्टर कितना सटीक है?',
    howAccurateAnswer: 'हमारा AI स्रोत विश्वसनीयता का विश्लेषण करके, तथ्यों को क्रॉस-रेफरेंस करके और सनसनीखेज भाषा पैटर्न का पता लगाकर 95%+ सटीकता प्राप्त करता है।',
    canUseOffline: 'क्या मैं Newsly ऑफलाइन उपयोग कर सकता हूं?',
    canUseOfflineAnswer: 'हां! हमारे पास एक फॉलबैक सारांशकर्ता है जो इंटरनेट कनेक्शन के बिना काम करता है, यह सुनिश्चित करता है कि आप हमेशा मुख्य सुविधाओं तक पहुंच सकते हैं।',
    
    // More Page
    moreOptions: 'और विकल्प',
    profile: 'प्रोफाइल',
    
    // Forgot Password
    forgotPasswordTitle: 'पासवर्ड भूल गए?',
    forgotPasswordDesc: 'रीसेट लिंक प्राप्त करने के लिए अपना ईमेल दर्ज करें',
    emailAddress: 'ईमेल पता',
    sendResetLink: 'रीसेट लिंक भेजें',
    sending: 'भेज रहा है...',
    checkEmail: 'अपना ईमेल जांचें',
    resetLinkSent: 'हमने पासवर्ड रीसेट लिंक भेज दिया है',
    didntReceive: 'ईमेल नहीं मिला? अपना स्पैम फोल्डर जांचें या',
    tryAgain: 'फिर से कोशिश करें',
    backToLogin: 'लॉगिन पर वापस जाएं',
    
    // Text to Speech
    ttsTitle: 'टेक्स्ट-टू-स्पीच',
    ttsSubtitle: 'किसी भी टेक्स्ट को प्राकृतिक-ध्वनि वाले ऑडियो में बदलें',
    enterTextTTS: 'टेक्स्ट दर्ज करें',
    typeOrPaste: 'स्पीच में बदलने के लिए यहां टेक्स्ट टाइप या पेस्ट करें...',
    characters: 'अक्षर',
    voice: 'आवाज',
    defaultVoice: 'डिफ़ॉल्ट आवाज',
    speed: 'गति',
    pitch: 'पिच',
    play: 'चलाएं',
    pause: 'रोकें',
    resume: 'जारी रखें',
    stop: 'बंद करें',
    speaking: 'बोल रहा है...',
    paused: 'रुका हुआ',
    playingAudio: 'ऑडियो चल रहा है...',
    
    // Category Page
    categoryNotFound: 'श्रेणी नहीं मिली',
    categoryNotFoundDesc: 'यह श्रेणी मौजूद नहीं है।',
    minRead: 'मिनट पढ़ें',
    
    // Admin
    dashboard: 'डैशबोर्ड',
    articles: 'लेख',
    users: 'उपयोगकर्ता',
    analytics: 'एनालिटिक्स',
    
    // Footer
    quickLinks: 'त्वरित लिंक',
    followUs: 'हमें फॉलो करें',
    allRightsReserved: 'सर्वाधिकार सुरक्षित',
    
    // Settings Privacy
    privacyDesc: 'अपना डेटा और गोपनीयता सेटिंग्स प्रबंधित करें',
  },
}

export const useTranslation = () => {
  const language = useSettingsStore((state) => state.language)
  return translations[language]
}
