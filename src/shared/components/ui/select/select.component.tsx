import { AnimatePresence, motion } from 'framer-motion'

import { FC, useState } from 'react'

import { IconUpArrow } from '@/shared/icons'

import styles from './select.module.scss'
import { useTranslation } from 'react-i18next'

// animation
const variants = {
  initial: {
    opacity: 0,
    y: '-15rem',
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  exit: {
    opacity: 0,
    y: '-15rem',
  },
}

//interface
interface ISelect {
  selectedValue: string
  setSelectedValue: (value: string) => void
  duration?: number | null
}

//component
export const SelectComponent: FC<Readonly<ISelect>> = ({
  selectedValue,
  setSelectedValue,
  duration,
}) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  const periods = [
    { value: 'day', title: t('periods.day') },
    { value: 'week', title: t('periods.week') },
    { value: 'month', title: t('periods.month') },
  ]

  const periodsWithCustom =
    duration == null || selectedValue !== 'custom'
      ? periods
      : [
          ...periods,
          {
            value: 'custom',
            title:
              duration <= 0.1
                ? t('periods.custom_one') // По умолчанию "1 день"
                : t('periods.custom_many', { count: Math.round(duration) + 1 }), // Для остальных значений
          },
        ]

  //return
  return (
    <div className={`${styles.select} ${isExpanded && styles.expanded}`}>
      <div
        className={`${styles.active_value} ${isExpanded && styles.expanded} ${styles.select__item}`}
        onClick={() => {
          setIsExpanded(!isExpanded)
        }}
      >
        {periodsWithCustom.find((item) => item.value === selectedValue)?.title} <IconUpArrow />
      </div>

      <AnimatePresence mode={'wait'}>
        {isExpanded && (
          <div className={`${styles.select__dropdown}`}>
            <motion.div
              key={'language_dropdown'}
              variants={variants}
              initial={'initial'}
              animate={'animate'}
              exit={'exit'}
            >
              <ul className={styles.select__list}>
                {periodsWithCustom
                  .filter((item) => item.value !== selectedValue)
                  .map((item) => (
                    <li
                      onClick={() => {
                        setSelectedValue(item.value)
                        setIsExpanded(false)
                      }}
                      key={item.value}
                      className={styles.select__item}
                    >
                      {item.title}
                    </li>
                  ))}
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
export default SelectComponent
