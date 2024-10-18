'use client'
import { categories } from './data'
import PhotoTutorialComponent from './elements/photo-tutorial/photo-tutorial.component'
import { FC } from 'react'
import { IconArrow, IconNextArrow } from '@/shared/icons'
import { ModalGettingToInstructionsComponent } from '@/shared/components'
import { ImageCapybaraTeacher } from '@/shared/images'
import styles from './tutorials.module.scss'
import { useTutorialsStore } from '@/shared/stores'

// interface
interface ITutorials {}

// component
export const TutorialsComponent: FC<Readonly<ITutorials>> = () => {
  // Используем состояние из Zustand-хранилища
  const {
    selectedCategory,
    selectedTechnique,
    expandedTechnique,
    setSelectedCategory,
    setSelectedTechnique,
    setExpandedTechnique,
  } = useTutorialsStore()

  // Получаем заголовок в зависимости от состояния
  const getTitle = () => {
    if (selectedTechnique) {
      const selectedCategoryData = categories.find((category) => category.id === selectedCategory)
      const selectedTechniqueData = selectedCategoryData?.techniques.find(
        (technique) => technique.id === selectedTechnique,
      )
      return selectedTechniqueData?.title || 'Техніки'
    } else if (selectedCategory) {
      const selectedCategoryData = categories.find((category) => category.id === selectedCategory)
      return selectedCategoryData?.title || 'Техніки'
    } else {
      return 'Техніки'
    }
  }

  return (
    <section className={`${styles.tutorials} container`}>
      {/* Заголовок изменяется в зависимости от состояния */}
      <h1 className={`${styles.tutorials__title} title`}>{getTitle()}</h1>

      {/* Кнопки выбора категории */}
      {!selectedCategory && (
        <div className={styles.tutorials__buttons}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={styles.tutorials__button}
              onClick={() => {
                setSelectedCategory(category.id)
                setSelectedTechnique(null) // Сбрасываем выбранную технику при выборе новой категории
              }}
            >
              {category.title}
            </button>
          ))}
        </div>
      )}

      {/* Список техник для выбранной категории */}
      {selectedCategory && !selectedTechnique && (
        <div className={styles.tutorials__content}>
          {categories
            .find((category) => category.id === selectedCategory)
            ?.techniques.map((technique) => (
              <div className={styles.tutorials__box} key={technique.id}>
                <div
                  className={`${styles.tutorials__box_title} ${expandedTechnique === technique.id && styles.expanded}`}
                >
                  <p>{technique.title}</p>
                  <button
                    onClick={() => {
                      setExpandedTechnique(expandedTechnique === technique.id ? null : technique.id)
                      setSelectedTechnique(technique.id) // Устанавливаем выбранную технику
                    }}
                    className={`${styles.tutorials__box_btn} ${expandedTechnique === technique.id && styles.expanded}`}
                  >
                    <IconNextArrow />
                  </button>
                </div>
              </div>
            ))}
          <button className={styles.tutorials__back_btn} onClick={() => setSelectedCategory(null)}>
            <IconArrow />
          </button>
        </div>
      )}

      {/* Инструкции для выбранной техники */}
      {selectedTechnique && (
        <div className={styles.tutorials__instructions}>
          {(() => {
            const selectedCategoryData = categories.find(
              (category) => category.id === selectedCategory,
            )
            const selectedTechniqueData = selectedCategoryData?.techniques.find(
              (technique) => technique.id === selectedTechnique,
            )

            if (selectedTechniqueData) {
              return (
                <div>
                  {/* Используем PhotoTutorialComponent для отображения слайдов */}
                  {selectedTechniqueData.type === 'photo' &&
                  selectedTechniqueData.array &&
                  selectedTechniqueData.array.length > 0 ? (
                    <PhotoTutorialComponent array={selectedTechniqueData.array} />
                  ) : (
                    <p>Изображения не найдены.</p>
                  )}
                  {/* Кнопка для возврата к списку техник */}
                  <button
                    className={styles.tutorials__back_btn}
                    onClick={() => {
                      setSelectedTechnique(null)
                      setExpandedTechnique(null) // Сбрасываем состояние развернутой техники
                    }}
                  >
                    <IconArrow />
                  </button>
                </div>
              )
            }

            return null
          })()}
        </div>
      )}

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
