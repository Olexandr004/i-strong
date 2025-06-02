import React, { useEffect, useState } from 'react'
import { IconArrow, IconNextArrow, IconGuides } from '@/shared/icons'
import { useChestStore, useUserStore } from '@/shared/stores'
import { useRouter } from 'next/navigation'
import styles from './chest.module.scss'
import { PhotoTutorialComponent } from '@/modules/views/tutorials/elements/'
import { DiaryNoteCardViewComponent } from '@/modules/views/diary/elements'
import { ModalGettingToInstructionsComponent } from '@/shared/components'
import { LoadingComponent } from '@/modules/layouts/loading'
import { useTranslation } from 'react-i18next'

const ChestComponent: React.FC = () => {
  const { view, setView } = useChestStore()
  const router = useRouter()
  const [favoriteTechniques, setFavoriteTechniques] = useState<any[]>([])
  const [selectedTechnique, setSelectedTechnique] = useState<any | null>(null)
  const [favoriteDiaryEntries, setFavoriteDiaryEntries] = useState<any[]>([])
  const [guideImages, setGuideImages] = useState<string[]>([]) // Состояние для изображений
  const [isModalActive, setIsModalActive] = useState(false) // Для контроля модала
  const [isLoading, setIsLoading] = useState(true)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const token = useUserStore((state) => state.user?.access_token)
  const { t } = useTranslation()

  useEffect(() => {
    setView('main')
    setSelectedTechnique(null)
  }, [])

  const goBack = () => {
    if (selectedTechnique) {
      setSelectedTechnique(null)
      setView('techniques')
    } else {
      setView('main')
    }
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search) // Получаем параметры из URL
    const section = searchParams.get('section') // Извлекаем параметр section

    if (section === 'diary') {
      setView('diary')
    } else if (section === 'techniques') {
      setView('techniques')
    }
  }, [router])

  const fetchFavoriteTechniques = async () => {
    try {
      // Устанавливаем статус загрузки
      setIsLoading(true)

      // Симулируем задержку для показа загрузки хотя бы на 1 секунду
      setTimeout(async () => {
        try {
          const response = await fetch('https://istrongapp.com/api/users/favorites/techniques/', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            setFavoriteTechniques(data.favorite_techniques.map((item: any) => item.technique) || [])
          } else {
            console.error('Ошибка при получении избранных техник:', response.status)
          }
        } catch (error) {
          console.error('Ошибка при получении избранных техник:', error)
        } finally {
          setIsLoading(false) // Завершаем загрузку
          setIsDataLoaded(true) // Устанавливаем, что данные загружены
        }
      }, 1000) // 1 секунда задержки
    } catch (error) {
      console.error('Ошибка при загрузке:', error)
      setIsLoading(false) // Завершаем загрузку в случае ошибки
      setIsDataLoaded(true) // Устанавливаем, что данные загружены (для обработок ошибок)
    }
  }

  const fetchTechniqueById = async (id: string) => {
    try {
      const response = await fetch(`https://istrongapp.com/api/techniques/${id}/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSelectedTechnique(data.technique)
      } else {
        console.error('Ошибка при получении техники по ID:', response.status)
      }
    } catch (error) {
      console.error('Ошибка при получении техники по ID:', error)
    }
  }

  const fetchFavoriteDiaryEntries = async () => {
    try {
      // Устанавливаем статус загрузки
      setIsLoading(true)

      // Симулируем задержку для показа загрузки хотя бы на 1 секунду
      setTimeout(async () => {
        try {
          const response = await fetch('https://istrongapp.com/api/users/favorites/diary/', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            setFavoriteDiaryEntries(data.favorite_notes || [])
          } else {
            console.error('Ошибка при получении избранных записей дневника:', response.status)
          }
        } catch (error) {
          console.error('Ошибка при получении избранных записей дневника:', error)
        } finally {
          setIsLoading(false) // Завершаем загрузку после обработки данных
          setIsDataLoaded(true) // Устанавливаем, что данные загружены
        }
      }, 1000) // 1 секунда задержки
    } catch (error) {
      console.error('Ошибка при загрузке:', error)
      setIsLoading(false)
      setIsDataLoaded(true)
    }
  }

  useEffect(() => {
    if (view === 'techniques') {
      fetchFavoriteTechniques()
    } else if (view === 'diary') {
      fetchFavoriteDiaryEntries()
    }
  }, [view])

  const handleTechniqueSelect = (technique: any) => {
    fetchTechniqueById(technique.id)
  }

  // Функция для удаления тегов <p> из текста
  const stripHtmlTags = (text: string) => text.replace(/<[^>]+>/g, '')

  // Функция для получения изображений
  const fetchGuideImages = async () => {
    try {
      const response = await fetch('https://istrongapp.com/api/guides/favorites', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Ошибка при получении изображений')
      }

      const data = await response.json()
      if (data && data.guide && Array.isArray(data.guide.images)) {
        const images = data.guide.images.map((item: { image: string }) => item.image)
        setGuideImages(images) // Сохраняем только ссылки на изображения
      } else {
        console.error('Изображения не найдены или не являются массивом')
      }
    } catch (error) {
      console.error('Ошибка при получении изображений:', error)
    }
  }

  const handleIconGuidesClick = () => {
    fetchGuideImages() // Загружаем изображения
    setIsModalActive(true) // Открываем модальное окно
  }

  const renderContent = () => {
    if (selectedTechnique) {
      return (
        <div className={styles.box__chest}>
          <IconArrow onClick={goBack} className={styles.backBtn__chest} />
          <h1>{selectedTechnique.name}</h1>
          {selectedTechnique.images && selectedTechnique.images.length > 0 ? (
            <PhotoTutorialComponent array={selectedTechnique.images.map((img: any) => img.image)} />
          ) : (
            <p></p>
          )}
          {selectedTechnique.description && (
            <div>
              {selectedTechnique.description.split('\n').map((line: string, index: number) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          )}
        </div>
      )
    }

    switch (view) {
      case 'techniques':
        return (
          <div className={styles.box__chest}>
            <IconArrow onClick={goBack} className={styles.backBtn__chest} />
            <h1>{t('techniques')}</h1>

            {/* Показываем индикатор загрузки, если данные еще не загружены */}
            {isLoading && !isDataLoaded ? (
              <LoadingComponent /> // Показываем компонент загрузки
            ) : favoriteTechniques.length > 0 ? (
              <ul>
                {favoriteTechniques.map((technique) => (
                  <li key={technique.id} onClick={() => handleTechniqueSelect(technique)}>
                    {technique.name}
                    <IconNextArrow />
                  </li>
                ))}
              </ul>
            ) : (
              <p>{t('no_favorite_techniques')}</p>
            )}
          </div>
        )
      case 'diary':
        return (
          <div>
            <IconArrow onClick={goBack} className={styles.backBtn__chest} />
            <h1>{t('diary')}</h1>

            {/* Показываем индикатор загрузки, если данные не загружены */}
            {isLoading && !isDataLoaded ? (
              <LoadingComponent />
            ) : favoriteDiaryEntries.length > 0 ? (
              favoriteDiaryEntries.map((entry) => (
                <DiaryNoteCardViewComponent
                  key={entry.id}
                  item={{
                    ...entry,
                    note: stripHtmlTags(entry.note || ''),
                    description:
                      entry.type === 'challenges' || entry.type === 'tracker'
                        ? t('not_found_entry')
                        : stripHtmlTags(entry.description || ''),
                  }}
                  type={entry.type}
                  showActions={false}
                />
              ))
            ) : (
              <p className={styles.box_chestText}>{t('no_favorite_entries')}</p>
            )}
          </div>
        )
      default:
        return (
          <div className={styles.box__chest}>
            <h1>{t('chest')}</h1>
            <button onClick={() => setView('techniques')} className={styles.btnDiaryTech}>
              {t('techniques')}
            </button>
            <button
              onClick={() => {
                setView('diary')
                const currentPath = window.location.pathname // Получаем текущий путь
                router.replace(`${currentPath}?section=diary`) // Обновляем URL с параметром
              }}
              className={styles.btnDiaryTech}
            >
              {t('diary')}
            </button>
            {/* Добавляем IconGuides для открытия модала */}
            <div className={styles.iconGuides} onClick={handleIconGuidesClick}>
              <IconGuides />
            </div>
          </div>
        )
    }
  }

  return (
    <div className={styles.container__chest}>
      {renderContent()}

      {/* Модальное окно для изображений */}
      <ModalGettingToInstructionsComponent
        title='Скарбничка - інструкції'
        images={guideImages}
        check='favorites'
        isModalActive={isModalActive}
        closeModal={() => setIsModalActive(false)} // Закрытие модала
      />
    </div>
  )
}

export default ChestComponent
