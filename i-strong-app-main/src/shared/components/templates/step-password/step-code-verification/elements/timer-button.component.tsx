import { differenceInSeconds } from 'date-fns'

import React, { FC, useEffect, useState } from 'react'

import styles from './timer-button.module.scss'

interface ITimerButton {
  initialTime: number
  onTimeComplete?: () => void
  onButtonClick: () => void
}

export const TimerButton: FC<ITimerButton> = ({ initialTime, onTimeComplete, onButtonClick }) => {
  const [targetTime, setTargetTime] = useState<Date>(new Date())
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [buttonEnabled, setButtonEnabled] = useState(false)

  useEffect(() => {
    setTargetTime(new Date(Date.now() + initialTime * 1000))
  }, [initialTime])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const difference = differenceInSeconds(targetTime, now)
      setTimeLeft(difference)

      if (difference <= 0) {
        clearInterval(interval)
        setButtonEnabled(true)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetTime, onTimeComplete])

  const handleButtonClick = () => {
    if (buttonEnabled) {
      onButtonClick()
      setTargetTime(new Date(Date.now() + initialTime * 1000))
      setButtonEnabled(false)
    }
  }

  return (
    <div>
      {timeLeft > 0 ? (
        <div className='text_medium'>Відправити повторно через 00:{timeLeft}</div>
      ) : (
        <button
          className={`text_medium ${styles.btn}`}
          onClick={handleButtonClick}
          disabled={!buttonEnabled}
        >
          Відправити код
        </button>
      )}
    </div>
  )
}
