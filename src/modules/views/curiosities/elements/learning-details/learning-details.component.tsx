import React from 'react'
import styles from './learning-details.module.scss'
import { useTranslation } from 'react-i18next'

interface LearningDetailsComponentProps {
  content: string
  type: string
  comicName: string // Добавьте пропс для имени комикса
}

const LearningDetailsComponent: React.FC<LearningDetailsComponentProps> = ({
  content,
  type,
  comicName,
}) => {
  const { t } = useTranslation()
  return (
    <div className={styles.learning_content}>
      {/* Условный рендеринг заголовков */}
      {type === 'what_is_it' && <h3>{t('learningDetails.what_is_it', { comicName })}</h3>}
      {type === 'what_it_gives' && <h3>{t('learningDetails.what_it_gives', { comicName })}</h3>}
      {type === 'tips' && <h3>{t('learningDetails.tips')}</h3>}
      {type === 'remember' && <h3>{t('learningDetails.remember')}</h3>}

      {/* Контент, который будет всегда */}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}

export default LearningDetailsComponent
