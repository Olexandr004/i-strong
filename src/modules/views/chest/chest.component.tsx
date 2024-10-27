import React, { useEffect, useState } from 'react'
import { IconArrow, IconNextArrow } from '@/shared/icons'
import { useChestStore, useUserStore } from '@/shared/stores'
import styles from './chest.module.scss'
import { PhotoTutorialComponent } from '@/modules/views/tutorials/elements/' // Убедитесь, что путь импорта правильный

const ChestComponent: React.FC = () => {
  const { view, setView } = useChestStore()
  const [favoriteTechniques, setFavoriteTechniques] = useState<any[]>([])
  const [selectedTechnique, setSelectedTechnique] = useState<any | null>(null)
  const token = useUserStore((state) => state.user?.access_token)

  // Установите начальное состояние при монтировании компонента
  useEffect(() => {
    setView('main') // Устанавливаем вид на 'main' при загрузке компонента
    setSelectedTechnique(null) // Сбрасываем выбранную технику
  }, [])

  // Функция для возврата назад
  const goBack = () => {
    if (selectedTechnique) {
      setSelectedTechnique(null) // Сбрасываем выбранную технику
      setView('techniques') // Возвращаемся к списку техник
    } else {
      setView('main') // Возвращаемся на главный экран
    }
  }

  const fetchFavoriteTechniques = async () => {
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
        setSelectedTechnique(data.technique) // Сохраняем данные техники
      } else {
        console.error('Ошибка при получении техники по ID:', response.status)
      }
    } catch (error) {
      console.error('Ошибка при получении техники по ID:', error)
    }
  }

  useEffect(() => {
    if (view === 'techniques') {
      fetchFavoriteTechniques() // Загружаем избранные техники при переключении на 'techniques'
    }
  }, [view])

  const handleTechniqueSelect = (technique: any) => {
    fetchTechniqueById(technique.id) // Загружаем технику по ID
  }

  const renderContent = () => {
    if (selectedTechnique) {
      return (
        <div className={styles.box__chest}>
          <IconArrow onClick={goBack} className={styles.backBtn__chest} />
          <h1>{selectedTechnique.name}</h1>
          {selectedTechnique.images && selectedTechnique.images.length > 0 ? (
            <PhotoTutorialComponent
              array={selectedTechnique.images.map((img: any) => img.image)} // Передаем только URL изображений
            />
          ) : (
            <p>No images found.</p>
          )}
          {selectedTechnique.description && <p>{selectedTechnique.description}</p>}
        </div>
      )
    }

    switch (view) {
      case 'techniques':
        return (
          <div className={styles.box__chest}>
            <IconArrow onClick={goBack} className={styles.backBtn__chest} />
            <h1>Техніки</h1>
            {favoriteTechniques.length > 0 ? (
              <ul>
                {favoriteTechniques.map((technique) => (
                  <li key={technique.id} onClick={() => handleTechniqueSelect(technique)}>
                    {technique.name}
                    <IconNextArrow />
                  </li>
                ))}
              </ul>
            ) : (
              <p>Немає вибраних технік.</p>
            )}
          </div>
        )
      case 'diary':
        return (
          <div className={styles.box__chest}>
            <IconArrow onClick={goBack} className={styles.backBtn__chest} />
            <h1>Щоденник</h1>
          </div>
        )
      default:
        return (
          <div className={styles.box__chest}>
            <h1>Скарбничка</h1>
            <button onClick={() => setView('techniques')} className={styles.btnDiaryTech}>
              Техніки
            </button>
            <button onClick={() => setView('diary')} className={styles.btnDiaryTech}>
              Щоденник
            </button>
          </div>
        )
    }
  }

  return <div className={styles.container__chest}>{renderContent()}</div>
}

export default ChestComponent
