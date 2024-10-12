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

  useEffect(() => {
    if (avatarImage) {
      setCurrentImage(avatarImage)
    }
  }, [avatarImage])

  const handleButtonClick = async (text: string) => {
    let newImage: string | undefined
    const previousImage = currentImage // Сохраняем текущее изображение

    try {
      // Запрашиваем разрешение на доступ к галерее
      if (text === 'Завантажити з галереї') {
        const status = await Camera.requestPermissions({ permissions: ['camera', 'photos'] })

        if (status.camera !== 'granted' || status.photos !== 'granted') {
          setError('Необхідно надати доступ до камери та галереї')
          return
        }
      }

      // Запрашиваем разрешение на доступ к камере
      if (text === 'Зробити фото') {
        const status = await Camera.requestPermissions({ permissions: ['camera'] })

        if (status.camera !== 'granted') {
          setError('Необхідно надати доступ до камери')
          return
        }
      }

      // Логика получения изображения
      let image
      if (text === 'Зробити фото') {
        image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera,
          saveToGallery: true,
          correctOrientation: true,
        })
      } else if (text === 'Завантажити з галереї') {
        image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          source: CameraSource.Photos,
          resultType: CameraResultType.Base64,
        })
      }

      if (image && image.base64String) {
        newImage = `data:image/jpeg;base64,${image.base64String}` // Получаем URL для изображения

        // Валидация формата и размера
        const blob = await fetch(newImage).then((res) => res.blob())
        const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/heif']

        // Проверка формата изображения
        if (!validFormats.includes(blob.type)) {
          throw new Error('Неприпустимий формат файлу.')
        }

        // Проверка размера файла
        if (blob.size > 5 * 1024 * 1024) {
          throw new Error('Розмір файлу перевищує 5 МБ.')
        }

        // Устанавливаем новое изображение
        setCurrentImage(newImage)
        setIsSaveButtonDisabled(false)
        setError(null)
      } else {
        throw new Error('Не вдалося отримати URL зображення')
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'Виникла помилка при завантаженні зображення'
      setError(errorMessage)
      // Восстанавливаем предыдущее изображение, если произошла ошибка
      setCurrentImage(previousImage)
      setIsSaveButtonDisabled(true)
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
      let errorMessage = 'Невідома помилка'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      setError(errorMessage)
    },
  })

  const handleSaveClick = async () => {
    try {
      // Получаем blob из currentImage
      const file = await fetch(currentImage).then((res) => res.blob())

      mutation.mutate(file)
    } catch (error) {
      let errorMessage = 'Невідома помилка'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      setError(errorMessage)
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
              setError('Неможливо завантажити зображення')
            }}
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.buttons}>
          <ButtonComponent variant={'outlined'} onClick={() => handleButtonClick('Зробити фото')}>
            Зробити фото
          </ButtonComponent>
          <ButtonComponent
            variant={'outlined'}
            onClick={() => handleButtonClick('Завантажити з галереї')}
          >
            Завантажити з галереї
          </ButtonComponent>
        </div>
        <div className={styles.footer}>
          <button onClick={handleDeleteClick} className={styles.button}>
            <IconDelete />
            <span>Видалити</span>
          </button>
          <ButtonComponent
            size={'regular'}
            onClick={handleSaveClick}
            disabled={isSaveButtonDisabled || isLoading}
          >
            {isLoading ? 'Збереження...' : 'Зберегти'}
          </ButtonComponent>
        </div>
      </div>
    </BaseModalComponent>
  )
}

export default AvatarComponent
