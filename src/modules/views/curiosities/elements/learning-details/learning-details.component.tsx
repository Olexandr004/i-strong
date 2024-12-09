import React from 'react'
import styles from './learning-details.module.scss'

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
  return (
    <div className={styles.learning_content}>
      {/* Условный рендеринг заголовков */}
      {type === 'what_is_it' && <h3>Що таке {comicName}?</h3>}
      {type === 'what_it_gives' && <h3>Що дає {comicName}?</h3>}
      {type === 'tips' && <h3>Поради від Капібари</h3>}
      {type === 'remember' && <h3>Пам&apos;ятки</h3>}

      {/* Контент, который будет всегда */}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}

export default LearningDetailsComponent
