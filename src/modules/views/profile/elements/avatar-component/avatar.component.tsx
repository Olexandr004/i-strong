'use client'

import { FC, useEffect, useState } from 'react'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import ky from 'ky'
import Image from 'next/image'
import { ButtonComponent } from '@/shared/components'
import { BaseModalComponent } from '@/shared/components'
import { IconClose, IconDelete } from '@/shared/icons'
import { ImageAvatar } from '@/shared/images'
import { useCommonStore, useUserStore } from '@/shared/stores'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import styles from './avatar.module.scss'

interface ErrorResponse {
  error?: string
}

interface UpdateAvatarResponse {
  avatar: { avatar: string }
}

const AvatarComponent: FC = () => {
  const { avatarImage, handleChangeCommonStore } = useCommonStore((state) => ({
    avatarImage: state.avatarImage,
    handleChangeCommonStore: state.handleChangeCommonStore,
  }))

  const { user, handleChangeUserStore } = useUserStore((state) => ({
    user: state.user,
    handleChangeUserStore: state.handleChangeUserStore,
  }))

  const token = user?.access_token

  const [currentImage, setCurrentImage] = useState<string>(avatarImage || ImageAvatar.src)
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [log, setLog] = useState<string | null>(null) // State для логов

  useEffect(() => {
    if (avatarImage) {
      setCurrentImage(avatarImage)
    }
  }, [avatarImage])

  const handleButtonClick = async (text: string) => {
    let newImage: string | undefined

    try {
      // Запрашиваем разрешение на доступ к галерее
      if (text === 'Загрузити з галереї') {
        const status = await Camera.requestPermissions({ permissions: ['camera', 'photos'] })

        if (status.camera !== 'granted' || status.photos !== 'granted') {
          setError('Необходимо предоставить доступ к камере и галерее')
          return
        }
      }

      // Запрашиваем разрешение на доступ к камере
      if (text === 'Зробити фото') {
        const status = await Camera.requestPermissions({ permissions: ['camera'] })

        if (status.camera !== 'granted') {
          setError('Необходимо предоставить доступ к камере')
          return
        }
      }

      // Логика получения изображения
      if (text === 'Зробити фото') {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          saveToGallery: true,
          correctOrientation: true,
        })
        newImage = image.webPath // Получаем URL для изображения
      } else if (text === 'Загрузити з галереї') {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          source: CameraSource.Photos,
          resultType: CameraResultType.Uri,
        })
        newImage = image.webPath // Получаем URL для изображения
      }

      if (newImage) {
        // Получаем blob
        const response = await fetch(newImage)
        if (!response.ok) {
          setError('Не удалось получить изображение')
          setLog(`Ошибка fetch: ${response.statusText}`)
          return
        }

        const blob = await response.blob()

        // Создаем URL для blob
        const blobUrl = URL.createObjectURL(blob)
        setLog(`Полученное изображение: ${blobUrl}`)
        setCurrentImage(blobUrl) // Устанавливаем blob URL в качестве текущего изображения
        setIsSaveButtonDisabled(false)
        setError(null)
      } else {
        setError('Не удалось получить URL изображения')
        setLog('Не удалось получить URL изображения')
      }
    } catch (err) {
      setError('Произошла ошибка при загрузке изображения')
      setLog(`Ошибка при загрузке изображения: ${err}`)
    }
  }

  const mutation: UseMutationResult<UpdateAvatarResponse, unknown, Blob, unknown> = useMutation({
    mutationFn: async (file: Blob) => {
      const formData = new FormData()
      formData.append('media', file, 'avatar.jpg')

      const api = ky.extend({
        prefixUrl: 'https://istrongapp.com/api',
        throwHttpErrors: false,
      })

      try {
        const response = await api.post('users/profile/update-avatar/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        if (!response.ok) {
          const jsonResponse = await response.json().catch(() => ({}))
          const errorResponse: ErrorResponse =
            typeof jsonResponse === 'object' && jsonResponse !== null
              ? (jsonResponse as ErrorResponse)
              : {}

          throw new Error(errorResponse.error || 'Відбулася помилка під час оновлення аватара')
        }

        return await response.json()
      } catch (error) {
        throw new Error('Не вдалося оновити аватар')
      }
    },
    onSuccess: (responseData) => {
      setLog(`Аватар успешно обновлён: ${responseData.avatar.avatar}`)
      handleChangeCommonStore({ avatarImage: responseData.avatar.avatar })

      const updatedUser = {
        id: user?.id || 0,
        name: user?.name || '',
        phone_number: user?.phone_number || '',
        access_token: user?.access_token || '',
        coins: user?.coins || 0,
        avatar: responseData.avatar.avatar,
        mood: user?.mood || { mood: '', date: '' },
        has_dairy_password: user?.has_dairy_password || false,
        activity: user?.activity || {
          challenges_visited: false,
          diary_visited: false,
          id: 0,
          instructions_visited: false,
          mood_stats_visited: false,
          shop_visited: false,
        },
      }

      handleChangeUserStore({ user: updatedUser })
      setIsSaveButtonDisabled(true)
      setError(null)
      handleChangeCommonStore({ isModalActive: false })
    },
    onError: (error: unknown) => {
      let errorMessage = 'Неизвестная ошибка'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      setError(errorMessage)
      setLog(`Ошибка при обновлении аватара: ${errorMessage}`)
    },
  })

  const handleSaveClick = async () => {
    try {
      // Получаем blob из currentImage
      const file = await fetch(currentImage).then((res) => res.blob())
      setLog(`File MIME type: ${file.type}`)

      const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/heif']
      if (!validFormats.includes(file.type)) {
        throw new Error(
          'Неприпустимий формат файлу. Формати, що підтримуються: jpg, jpeg, png, heif.',
        )
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Розмір файлу не повинен перевищувати 5 МБ.')
      }

      mutation.mutate(file)
    } catch (error) {
      let errorMessage = 'Неизвестная ошибка'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      setError(errorMessage)
      setLog(`Ошибка при сохранении аватара: ${errorMessage}`)
    }
  }

  const handleDeleteClick = () => {
    setCurrentImage(ImageAvatar.src)
    setIsSaveButtonDisabled(false)
  }

  const isLoading = mutation.status === 'pending'

  return (
    <BaseModalComponent>
      <div className={styles.modal__box}>
        <div className={styles.header}>
          <span>Аватарка</span>
          <IconClose onClick={() => handleChangeCommonStore({ isModalActive: false })} />
        </div>
        <div className={styles.image_container}>
          <Image
            src={currentImage}
            alt='User Avatar'
            layout='fill'
            objectFit='cover'
            priority
            onError={() => {
              setError('Не удалось загрузить изображение')
              setLog(`Ошибка при загрузке изображения: Не удалось загрузить изображение`)
            }}
          />
        </div>
        <div className={styles.buttons}>
          <ButtonComponent variant={'outlined'} onClick={() => handleButtonClick('Зробити фото')}>
            Зробити фото
          </ButtonComponent>
          <ButtonComponent
            variant={'outlined'}
            onClick={() => handleButtonClick('Загрузити з галереї')}
          >
            Загрузити з галереї
          </ButtonComponent>
        </div>
        <div className={styles.footer}>
          <div>
            <ButtonComponent
              size={'regular'}
              onClick={handleSaveClick}
              disabled={isSaveButtonDisabled || isLoading}
            >
              {isLoading ? 'Збереження...' : 'Зберегти'}
            </ButtonComponent>
            <ButtonComponent variant={'outlined'} onClick={handleDeleteClick}>
              <IconDelete />
            </ButtonComponent>
          </div>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {log && <div className={styles.log}>{log}</div>}
      </div>
    </BaseModalComponent>
  )
}

export default AvatarComponent
