import { AnimatePresence, motion } from 'framer-motion'

import { FC, useState } from 'react'

import { IconUpArrow } from '@/shared/icons'

import styles from './select.module.scss'

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
  const [isExpanded, setIsExpanded] = useState(false)

  const periods = [
    { value: 'day', title: 'Сьогодні' },
    { value: 'week', title: 'Тиждень' },
    { value: 'month', title: 'Місяць' },
  ]

  const periodsWithCustom = !duration
    ? periods
    : [
        ...periods,
        {
          value: 'custom',
          title: duration != null ? `Дні: ${Math.floor(duration) + 1}` : 'Період',
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
