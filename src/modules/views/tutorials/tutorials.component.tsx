'use client'

import React, { FC, useEffect, useState } from 'react'
import { IconArrow, IconNextArrow, IconFavorite, IconGuides } from '@/shared/icons'
import { ModalGettingToInstructionsComponent } from '@/shared/components'
import { useUserStore } from '@/shared/stores'
import { PhotoTutorialComponent } from '@/modules/views/tutorials/elements'
import { LoadingComponent } from '@/modules/layouts/loading'
import styles from './tutorials.module.scss'
import { useTranslation } from 'react-i18next'

interface IFavoriteTechnique {
  technique: {
    id: number
    // add any other properties you expect to have here
  }
}

interface IFavoriteData {
  favorite_techniques: IFavoriteTechnique[]
}

interface ICategory {
  id: number
  name: string
  guide: { image: string }[] // Добавляем свойство guide
}

interface ICategory {
  id: number
  name: string
}

interface ITechnique {
  id: number
  name: string
  description?: string
  images?: { image: string }[]
}

interface ITutorialsComponent {}

export const TutorialsComponent: FC<Readonly<ITutorialsComponent>> = () => {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [techniques, setTechniques] = useState<ITechnique[]>([])
  const [selectedTechniqueData, setSelectedTechniqueData] = useState<ITechnique | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [guideImages, setGuideImages] = useState<string[]>([])
  const [isModalActive, setIsModalActive] = useState<boolean>(false)
  const [isModalTechniqueActive, setIsModalTechniqueActive] = useState<boolean>(false)
  const [categoryImages, setCategoryImages] = useState<string[]>([])
  const { t } = useTranslation()

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedTechnique, setSelectedTechnique] = useState<number | null>(null)
  const [expandedTechnique, setExpandedTechnique] = useState<number | null>(null)

  const token = useUserStore((state) => state.user?.access_token)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://istrongapp.com/api/techniques/categories/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Fetched categories:', data)

          // Сохраняем изображения для каждой категории
          const categoriesWithImages = data.categories.map((category: ICategory) => ({
            ...category,
            images: category.guide.map((guide: { image: string }) => guide.image),
          }))

          setCategories(categoriesWithImages)

          // Если выбрана категория, сразу устанавливаем изображения
          if (selectedCategory) {
            const selectedCategoryData = categoriesWithImages.find(
              (category: ICategory) => category.id === selectedCategory,
            )
            if (selectedCategoryData) {
              setCategoryImages(selectedCategoryData.images)
            }
          }
        } else {
          console.error('Ошибка получения категорий:', response.status)
        }
      } catch (error) {
        console.error('Ошибка при запросе категорий:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [selectedCategory, token]) // Убедитесь, что selectedCategory обновляется

  useEffect(() => {
    if (selectedCategory) {
      const fetchTechniques = async () => {
        try {
          const response = await fetch(
            `https://istrongapp.com/api/techniques/category/${selectedCategory}/`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )

          if (response.ok) {
            const data = await response.json()

            // Добавляем тайм-аут на две секунды
            setTimeout(() => {
              setTechniques(data.techniques)
              setLoading(false)
            }, 1000)
          } else {
            console.error('Ошибка получения техник:', response.status)
          }
        } catch (error) {
          console.error('Ошибка при запросе техник:', error)
        }
      }

      fetchTechniques()
    }
  }, [selectedCategory, token])

  useEffect(() => {
    if (selectedTechnique) {
      const fetchTechniqueData = async () => {
        try {
          const response = await fetch(
            `https://istrongapp.com/api/techniques/${selectedTechnique}/`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )

          if (response.ok) {
            const data = await response.json()
            setSelectedTechniqueData(data.technique)

            // Устанавливаем состояние избранного на основе данных с сервера
            setIsFavorite(data.technique.is_favorite)
          } else {
            console.error('Ошибка получения техники:', response.status)
          }
        } catch (error) {
          console.error('Ошибка при запросе техники:', error)
        }
      }

      fetchTechniqueData()
    }
  }, [selectedTechnique, token])

  const handleFavoriteToggle = async () => {
    if (selectedTechnique === null) {
      console.error('Нет выбранной техники для изменения избранного')
      return
    }

    try {
      // Если техника уже в избранном
      if (isFavorite) {
        const response = await fetch(
          `https://istrongapp.com/api/users/favorites/techniques/${selectedTechnique}/`,
          {
            method: 'DELETE', // Удаляем технику из избранного
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (response.ok) {
          setIsFavorite(false) // Обновляем состояние на false
          console.log('Техника удалена из избранного')
        } else {
          console.error('Ошибка при удалении техники из избранного:', response.status)
        }
      } else {
        // Если техники нет в избранном
        const response = await fetch('https://istrongapp.com/api/users/favorites/techniques/', {
          method: 'POST', // Добавляем технику в избранное
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ technique_id: selectedTechnique, is_favorite: true }), // Передаем данные
        })

        if (response.ok) {
          setIsFavorite(true) // Обновляем состояние на true
          console.log('Техника добавлена в избранное')
        } else {
          const errorData = await response.json()
          console.error('Ошибка при добавлении техники в избранное:', response.status, errorData)
        }
      }
    } catch (error) {
      console.error('Ошибка при изменении состояния избранного:', error)
    }
  }

  const fetchGuideImages = async (guideType: string) => {
    try {
      const response = await fetch(`https://istrongapp.com/api/guides/${guideType}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Ошибка при получении изображений')
      }

      const data = await response.json()
      console.log('Fetched guide data:', data)

      if (data && data.guide && Array.isArray(data.guide.images)) {
        const images = data.guide.images.map((item: { image: string }) => item.image)
        setGuideImages(images) // Сохраняем только ссылки на изображения
      } else {
        console.error('Images are not an array or not found:', data.guide?.images)
      }
    } catch (error) {
      console.error('Error fetching guide images:', error)
    }
  }

  const getTitle = () => {
    if (selectedTechniqueData) {
      return selectedTechniqueData.name || t('techniques')
    } else if (selectedCategory) {
      const selectedCategoryData = categories.find((category) => category.id === selectedCategory)
      return selectedCategoryData?.name || t('techniques')
    } else {
      return t('techniques')
    }
  }

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <section className={`${styles.tutorials} container`}>
      <h1 className={`${styles.tutorials__title} title`}>{getTitle()}</h1>

      {!selectedCategory && (
        <div className={styles.tutorials__buttons}>
          <button
            className={styles.iconGuides}
            onClick={() => {
              fetchGuideImages('techniques') // Тип гида
              setIsModalActive(true) // Открытие модального окна
            }}
          >
            <IconGuides />
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={styles.tutorials__button}
              onClick={() => {
                setSelectedCategory(category.id)
                setSelectedTechnique(null)
                setTechniques([]) // Сбрасываем техники
                setLoading(true) // Включаем экран загрузки
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {selectedCategory && !selectedTechnique && (
        <div className={styles.tutorials__content}>
          {categoryImages.length > 0 && (
            <div className={styles.tutorials__category_images}>
              <button
                className={styles.iconGuides2}
                onClick={() => {
                  setGuideImages(categoryImages) // Устанавливаем изображения в состояние
                  setIsModalTechniqueActive(true) // Открываем модалку
                }}
              >
                <IconGuides /> {/* Иконка вместо изображений */}
              </button>
            </div>
          )}
          {techniques.map((technique) => (
            <div
              key={technique.id}
              className={`${styles.tutorials__box} ${expandedTechnique === technique.id && styles.expanded}`}
              onClick={() => {
                setExpandedTechnique(expandedTechnique === technique.id ? null : technique.id)
                setSelectedTechnique(technique.id)
              }}
            >
              <div className={styles.tutorials__box_title}>
                <p>{technique.name}</p>
                <button
                  className={`${styles.tutorials__box_btn} ${expandedTechnique === technique.id && styles.expanded}`}
                >
                  <IconNextArrow />
                </button>
              </div>
            </div>
          ))}
          <button className={styles.tutorials__back_btn} onClick={() => setSelectedCategory(null)}>
            <img src='/icon/arrow-back.svg' alt='arrow-back' />
          </button>
        </div>
      )}

      <ModalGettingToInstructionsComponent
        title='Челенджі - основне джерело заробітку монеток, виконуй завдання кожного дня щоб ставати краще'
        images={guideImages} // Передаем изображения из состояния
        check='techniques'
        isModalActive={isModalTechniqueActive}
        closeModal={() => setIsModalTechniqueActive(false)} // Закрытие модалки
      />

      {selectedTechnique && selectedTechniqueData && (
        <div className={styles.tutorials__instructions}>
          <div className={styles.tutorials__position_favoriteBtn}>
            <button className={styles.tutorials__favorite_btn} onClick={handleFavoriteToggle}>
              <IconFavorite fill={isFavorite ? '#BD3333' : 'none'} />
            </button>
            {selectedTechniqueData.images && selectedTechniqueData.images.length > 0 ? (
              <PhotoTutorialComponent
                array={selectedTechniqueData.images.map((img) => img.image)}
              />
            ) : (
              <p></p>
            )}
            {selectedTechniqueData.description && (
              <div>
                {selectedTechniqueData.description.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            )}

            <button
              className={styles.tutorials__back_btn}
              onClick={() => {
                setSelectedTechnique(null)
                setExpandedTechnique(null)
                setSelectedTechniqueData(null)
              }}
            >
              <img src='/icon/arrow-back.svg' alt='arrow-back' />
            </button>
          </div>
        </div>
      )}
      <ModalGettingToInstructionsComponent
        title='Челенджі - основне джерело заробітку монеток, виконуй завдання кожного дня щоб ставати краще'
        images={guideImages} // Передаем все изображения
        check='techniques'
        isModalActive={isModalActive}
        closeModal={() => setIsModalActive(false)}
      />
    </section>
  )
}

export default TutorialsComponent
