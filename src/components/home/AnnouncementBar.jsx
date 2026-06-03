import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { announcementMessages } from '../../services/homeData'

const tickerVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % announcementMessages.length)
    }, 3500)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <section className="announcement-bar">
      <div className="announcement-inner">
        <AnimatePresence mode="wait">
          <motion.p
            key={announcementMessages[index]}
            className="announcement-copy"
            variants={tickerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            {announcementMessages[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  )
}
