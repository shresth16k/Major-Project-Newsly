import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'
import MobileNavBar from './MobileNavBar'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const Layout = () => {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-1 pb-20 lg:pb-0"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <MobileNavBar />
    </div>
  )
}

export default Layout