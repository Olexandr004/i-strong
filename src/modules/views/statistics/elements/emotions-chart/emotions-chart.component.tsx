'use client'
import { AnimatePresence, motion } from 'framer-motion'

import { FC } from 'react'

import { IEmotions } from '@/interfaces/common'
import { IconMoodBlue, IconMoodGreen, IconMoodRed, IconMoodYellow } from '@/shared/icons'

import styles from './emotions-chart.module.scss'
import { useTranslation } from 'react-i18next'

const MOODS = [
  { icon: <IconMoodRed />, color: '#e79999', key: 'Зле' },
  { icon: <IconMoodBlue />, color: '#c0ebf1', key: 'Не дуже' },
  { icon: <IconMoodGreen />, color: '#C0D6A6', key: 'Нормально' },
  { icon: <IconMoodYellow />, color: '#F9E692', key: 'Чудово' },
]

//interface
interface IEmotionsChart {
  // emotions: { icon: ReactNode; percent: number; color: string }[]
  emotions: IEmotions
}

//component
export const EmotionsChartComponent: FC<Readonly<IEmotionsChart>> = ({ emotions }) => {
  const { t } = useTranslation()
  const getPercent = (key: string) => {
    switch (key) {
      case 'Не дуже':
        return emotions['Не дуже']
      case 'Чудово':
        return emotions['Чудово']
      case 'Нормально':
        return emotions['Нормально']
      case 'Зле':
        return emotions['Зле']
      default:
        return 1
    }
  }

  //return
  return (
    <>
      {Object.entries(emotions).length ? (
        <section className={styles.emotions_chart}>
          {MOODS.map((item) => (
            <div className={styles.emotions_chart__item} key={item.key}>
              {item.icon}

              <AnimatePresence mode={'wait'}>
                <motion.div
                  key={`${item.key}-${getPercent(item.key)}`}
                  initial={{ height: 2 }}
                  animate={{ height: getPercent(item.key) * 2 }}
                  exit={{ height: 0 }}
                  transition={{ duration: 1 }}
                >
                  <div
                    className={styles.emotions_chart__column}
                    style={{ backgroundColor: item.color }}
                  />
                </motion.div>
              </AnimatePresence>

              <span className={styles.emotions_chart__percant}>{getPercent(item.key) ?? 0}%</span>
            </div>
          ))}
        </section>
      ) : (
        <div className={styles.emotions_chart__no_data}>
          <p>{t('emotions_chart.no_data_title')}</p>
          <span>{t('emotions_chart.no_data_subtitle')}</span>
        </div>
      )}
    </>
  )
}
export default EmotionsChartComponent
