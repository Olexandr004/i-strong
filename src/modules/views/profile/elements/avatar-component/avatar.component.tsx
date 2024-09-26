'use client'
import Image from 'next/image'

import { FC, useEffect, useState } from 'react'

import { ButtonComponent } from '@/shared/components'
import { BaseModalComponent } from '@/shared/components'
import { IconClear, IconClose, IconEdit } from '@/shared/icons'
import { ImageAvatar, ImageCapybara } from '@/shared/images'
import { useCommonStore } from '@/shared/stores'

import styles from './avatar.module.scss'

interface IAvatarModal {}

const AvatarComponent: FC<Readonly<IAvatarModal>> = () => {
  const { avatarImage, handleChangeCommonStore } = useCommonStore((state) => ({
    avatarImage: state.avatarImage,
    handleChangeCommonStore: state.handleChangeCommonStore,
  }))
  const [currentImage, setCurrentImage] = useState<string>(avatarImage || ImageAvatar.src)
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    if (avatarImage) {
      setCurrentImage(avatarImage)
    }
  }, [avatarImage])

  const handleButtonClick = (text: string) => {
    const newImage = ImageCapybara.src
    setCurrentImage(newImage)
    setIsSaveButtonDisabled(false)
    console.log(text)
  }

  const handleClearClick = () => {
    setCurrentImage(ImageAvatar.src)
    setIsSaveButtonDisabled(false)
  }

  const handleSaveClick = () => {
    handleChangeCommonStore({ avatarImage: currentImage })
    setIsSaveButtonDisabled(true)
    setIsEditMode(false)
  }

  const handleEditClick = () => {
    setIsEditMode(true)
  }

  return (
    <BaseModalComponent>
      <div className={styles.modal__box}>
        <div className={styles.header}>
          <span className={styles.header__title}>Аватарка</span>
          <IconClose onClick={() => handleChangeCommonStore({ isModalActive: false })} />
        </div>
        <div className={styles.image_container}>
          <Image
            src={currentImage ? currentImage : ImageAvatar.src}
            alt={'name photo'}
            fill
            sizes={'40vw'}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </div>
        <div className={styles.buttons} style={{ display: isEditMode ? 'block' : 'none' }}>
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
          {isEditMode && currentImage !== ImageAvatar.src ? (
            <IconClear onClick={handleClearClick} />
          ) : (
            <IconEdit onClick={handleEditClick} />
          )}

          <ButtonComponent size={'small'} disabled={isSaveButtonDisabled} onClick={handleSaveClick}>
            Зберегти
          </ButtonComponent>
        </div>
      </div>
    </BaseModalComponent>
  )
}

export default AvatarComponent
