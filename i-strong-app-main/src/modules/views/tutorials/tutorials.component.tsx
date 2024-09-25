'use client'
import { steps } from './data'
import PhotoTutorialComponent from './elements/photo-tutorial/photo-tutorial.component'

import { FC, useState } from 'react'

import { VideoTutorialComponent } from '@/modules/views/tutorials/elements'
import { ModalGettingToInstructionsComponent } from '@/shared/components'
import { IconUpArrow } from '@/shared/icons'
import { ImageCapybaraTeacher } from '@/shared/images'

import styles from './tutorials.module.scss'

//interface
interface ITutorials {}

//component
export const TutorialsComponent: FC<Readonly<ITutorials>> = () => {
  const [expandedItem, setExpandedItem] = useState(1)
  console.log('🚀 ~ steps:', steps)
  //return
  return (
    <section className={`${styles.tutorials} container`}>
      <h1 className={`${styles.tutorials__title} title`}>Інструкції</h1>
      <div className={styles.tutorials__content}>
        {steps.map((item) => (
          <div className={styles.tutorials__box} key={item.id}>
            <div
              className={`${styles.tutorials__box_title} ${expandedItem === item.id && styles.expanded}`}
            >
              <p>{item.title}</p>

              <div
                className={`${styles.tutorials__box_wrapper} ${expandedItem === item.id && styles.expanded}`}
              >
                <div className={styles.tutorials__box_inner}>
                  {item.type === `photo` ? (
                    <PhotoTutorialComponent array={item.array} />
                  ) : (
                    <VideoTutorialComponent />
                  )}
                </div>
              </div>

              <button
                onClick={() => setExpandedItem(expandedItem === item.id ? -1 : item.id)}
                className={`${styles.tutorials__box_btn} ${expandedItem === item.id && styles.expanded}`}
              >
                <IconUpArrow />
              </button>
            </div>
          </div>
        ))}
      </div>
      <ModalGettingToInstructionsComponent
        title='Знання - сила! Вивчаючи інструкції ти зможеш дізнатись багато нового та знайти відповіді на свої запитання'
        image={ImageCapybaraTeacher}
        buttonText='Круто!'
        check='instructions'
      />
    </section>
  )
}
export default TutorialsComponent
