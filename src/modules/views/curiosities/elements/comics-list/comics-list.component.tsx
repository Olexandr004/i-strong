import React, { useState, useEffect } from 'react'
import styles from './comics-list.module.scss'
import { useUserStore } from '@/shared/stores'
import { ComicsDetailsComponent } from '@/modules/views/curiosities/elements'
import { IconNextArrow, IconArrow } from '@/shared/icons'

interface Comic {
  id: string | number
  name: string
}

interface ComicsListComponentProps {
  onBack: () => void // Проп для возврата
}

const ComicsListComponent: React.FC<ComicsListComponentProps> = ({ onBack }) => {
  const [comics, setComics] = useState<Comic[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedComicId, setSelectedComicId] = useState<string | number | null>(null)
  const token = useUserStore((state) => state.user?.access_token)

  useEffect(() => {
    if (!token) {
      setError('Токен авторизации отсутствует.')
      setLoading(false)
      return
    }

    const fetchComics = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('https://istrongapp.com/api/curiosities/comixes/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`)
        }

        const data = await response.json()
        setComics(data.comixes || [])
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Произошла неизвестная ошибка')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchComics()
  }, [token])

  const handleSelectComic = (comicId: string | number) => {
    setSelectedComicId(comicId)
  }

  const handleCloseDetails = () => {
    setSelectedComicId(null)
  }

  if (loading) return <p className={styles.loading}></p>
  if (error) return <p className={styles.error}>{error}</p>

  return (
    <div className={styles.comicsList}>
      {/* Кнопка возврата */}
      {!selectedComicId && (
        <div className={styles.btnBack} onClick={onBack}>
          <IconArrow />
        </div>
      )}
      {!selectedComicId && <h1>Комікси</h1>}

      {selectedComicId ? (
        <ComicsDetailsComponent comicId={selectedComicId} onClose={handleCloseDetails} />
      ) : (
        <ul>
          {comics.length ? (
            comics.map((comic) => (
              <li key={comic.id} onClick={() => handleSelectComic(comic.id)}>
                {comic.name}
                <IconNextArrow />
              </li>
            ))
          ) : (
            <p className={styles.empty}>Список коміксів порожній.</p>
          )}
        </ul>
      )}
    </div>
  )
}

export default ComicsListComponent
