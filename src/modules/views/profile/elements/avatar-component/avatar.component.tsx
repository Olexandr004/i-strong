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

// Интерфейс для ответа об ошибке
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

  const token = user?.access_token // Извлекаем токен

  const [currentImage, setCurrentImage] = useState<string>(avatarImage || ImageAvatar.src)
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true)
  const [error, setError] = useState<string | null>(null) // State для ошибок

  useEffect(() => {
    if (avatarImage) {
      setCurrentImage(avatarImage)
    }
  }, [avatarImage])

  const handleButtonClick = async (text: string) => {
    let newImage: string | undefined

    if (text === 'Зробити фото') {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        saveToGallery: true,
        correctOrientation: true,
      })
      newImage = image.webPath
    } else if (text === 'Загрузити з галереї') {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        source: CameraSource.Photos,
        resultType: CameraResultType.Uri,
      })
      newImage = image.webPath
    }

    if (newImage) {
      // Преобразуем URL в Blob
      const response = await fetch(newImage)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob) // Создаем URL из Blob

      setCurrentImage(url) // Устанавливаем URL для отображения
      setIsSaveButtonDisabled(false)
      setError(null) // Сброс ошибки при выборе нового изображения
    }
  }

  // Мутация для обновления аватара
  const mutation: UseMutationResult<UpdateAvatarResponse, unknown, Blob, unknown> = useMutation({
    mutationFn: async (file: Blob) => {
      const formData = new FormData()
      formData.append('media', file, 'avatar.jpg') // Добавляем файл в FormData

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
          const jsonResponse = await response.json().catch(() => ({})) // Обрабатываем ошибку JSON
          const errorResponse: ErrorResponse =
            typeof jsonResponse === 'object' && jsonResponse !== null
              ? (jsonResponse as ErrorResponse)
              : {}

          console.error('Ошибка на сервере:', errorResponse) // Логируем ошибку
          throw new Error(errorResponse.error || 'Відбулася помилка під час оновлення аватара')
        }

        return await response.json()
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error) // Логируем ошибку
        throw new Error('Не вдалося оновити аватар')
      }
    },
    onSuccess: (responseData) => {
      console.log('Аватар успешно обновлён:', responseData)
      handleChangeCommonStore({ avatarImage: responseData.avatar.avatar })

      // Обновляем avatar в user
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

      // Закрываем модальное окно после успешного сохранения
      handleChangeCommonStore({ isModalActive: false })
    },
    onError: (error: unknown) => {
      let errorMessage = 'Неизвестная ошибка'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      setError(errorMessage)
      console.error('Ошибка при обновлении аватара:', error)
    },
  })

  const handleSaveClick = async () => {
    try {
      const file = await fetch(currentImage).then((res) => res.blob())
      console.log('File MIME type:', file.type) // Проверьте MIME-тип файла

      // Проверка на формат и размер файла
      const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/heif']
      if (!validFormats.includes(file.type)) {
        throw new Error(
          'Неприпустимий формат файлу. Формати, що підтримуються: jpg, jpeg, png, heif.',
        )
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Розмір файлу не повинен перевищувати 5 МБ.')
      }

      // Вызываем мутацию для отправки файла
      mutation.mutate(file)
    } catch (error) {
      let errorMessage = 'Неизвестная ошибка'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      setError(errorMessage)
      console.error('Ошибка при сохранении аватара:', error)
    }
  }

  // Кнопка "Видалити"
  const handleDeleteClick = () => {
    setCurrentImage(ImageAvatar.src) // Сброс аватара на изображение по умолчанию
    setIsSaveButtonDisabled(false) // Активируем кнопку "Зберегти"
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
          <img
            src={currentImage}
            alt='User Avatar'
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
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
            <button onClick={handleDeleteClick} className={styles.button}>
              <IconDelete className={styles.icon_delete} />
              <span>Видалити</span>
            </button>
          </div>
          <ButtonComponent
            size={'regular'}
            disabled={isSaveButtonDisabled || isLoading}
            onClick={handleSaveClick}
          >
            {isLoading ? 'Збереження...' : 'Зберегти'}
          </ButtonComponent>
        </div>
        {error && <div>{error}</div>}
      </div>
    </BaseModalComponent>
  )
}

export default AvatarComponent
