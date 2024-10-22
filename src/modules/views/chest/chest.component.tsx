import React, { useEffect, useState } from 'react'
import { IconArrow, IconNextArrow } from '@/shared/icons'
import { useChestStore, useUserStore } from '@/shared/stores'
import styles from './chest.module.scss'
import { PhotoTutorialComponent } from '@/modules/views/tutorials/elements/' // Ensure the import path is correct

const ChestComponent: React.FC = () => {
  const { view, setView } = useChestStore()
  const [favoriteTechniques, setFavoriteTechniques] = useState<any[]>([])
  const [selectedTechnique, setSelectedTechnique] = useState<any | null>(null)
  const token = useUserStore((state) => state.user?.access_token)

  // Update goBack to check if the user is viewing a technique
  const goBack = () => {
    if (selectedTechnique) {
      setSelectedTechnique(null) // Reset selected technique
      setView('techniques') // Go back to techniques view
    } else {
      setView('main') // Default to main if no technique is selected
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
        console.error('Error fetching favorite techniques:', response.status)
      }
    } catch (error) {
      console.error('Error fetching favorite techniques:', error)
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
        setSelectedTechnique(data.technique) // Save technique data
      } else {
        console.error('Error fetching technique by ID:', response.status)
      }
    } catch (error) {
      console.error('Error fetching technique by ID:', error)
    }
  }

  useEffect(() => {
    if (view === 'techniques') {
      fetchFavoriteTechniques()
    }
  }, [view])

  const handleTechniqueSelect = (technique: any) => {
    fetchTechniqueById(technique.id) // Fetch technique by ID
  }

  const renderContent = () => {
    if (selectedTechnique) {
      return (
        <div className={styles.box__chest}>
          <IconArrow onClick={goBack} className={styles.backBtn__chest} />
          <h1>{selectedTechnique.name}</h1>
          {selectedTechnique.description && <p>{selectedTechnique.description}</p>}
          {selectedTechnique.images && selectedTechnique.images.length > 0 ? (
            <PhotoTutorialComponent
              array={selectedTechnique.images.map((img: any) => img.image)} // Pass image URLs only
            />
          ) : (
            <p>No images found.</p>
          )}
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
                  <li key={technique.id}>
                    {technique.name}
                    <IconNextArrow onClick={() => handleTechniqueSelect(technique)} />
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
