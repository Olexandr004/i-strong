import { motion } from 'framer-motion'

import React, { RefObject, useCallback, useEffect, useState } from 'react'

import { IconArrow } from '@/shared/icons'

import styles from './scroll-to-top-button.module.scss'

interface IScrollToTopButtonComponent {
  scrollContainerRef: RefObject<HTMLDivElement>
}

const buttonVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
}

const ScrollToTopButtonComponent: React.FC<IScrollToTopButtonComponent> = ({
  scrollContainerRef,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const handleScroll = useCallback(() => {
    const scrollPosition = scrollContainerRef.current?.scrollTop ?? 0
    setIsVisible(scrollPosition > 50)
  }, [scrollContainerRef])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    scrollContainer?.addEventListener('scroll', handleScroll)

    return () => scrollContainer?.removeEventListener('scroll', handleScroll)
  }, [scrollContainerRef, handleScroll])

  const scrollToTop = useCallback(() => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [scrollContainerRef])

  return (
    <motion.div
      initial='hidden'
      animate={isVisible ? 'visible' : 'hidden'}
      variants={buttonVariants}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        duration: 0.5,
      }}
      className={styles.button__wrap}
    >
      <button onClick={scrollToTop} className={styles.button__wrap__icon}>
        <IconArrow />
      </button>
    </motion.div>
  )
}

export default ScrollToTopButtonComponent
