import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

import { IProductCard } from '@/interfaces/store-interface'
import { IconLock } from '@/shared/icons'
import { useUserStore } from '@/shared/stores'

import { CoinsDisplayComponent } from '../../ui/coins-display'

import styles from './product-card.module.scss'

const ProductCardComponent: React.FC<IProductCard> = ({ product }) => {
  const { user, handleChangeUserStore } = useUserStore() // assuming `updateUser` is a function to update the user state

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  })

  const [isModalOpen, setIsModalOpen] = useState(false) // Состояние для модалки
  const [isProcessing, setIsProcessing] = useState(false) // Состояние для обработки покупки
  const [isBought, setIsBought] = useState(product.is_bought) // Локальное состояние для isBought
  const isAffordable = (user?.coins ?? 0) >= product.price
  const token = user?.access_token

  // Открытие модалки при клике на карточку товара
  const handleCardClick = () => {
    if (!isBought) {
      setIsModalOpen(true) // Открываем модалку, если товар не куплен
    }
  }

  // Закрытие модалки
  const handleCloseModal = () => {
    console.log('Закрытие модалки') // Логируем вызов
    setIsModalOpen(false)
  }

  // Обработка покупки
  const handlePurchase = async () => {
    console.log('Обработчик покупки сработал') // Логируем вызов обработчика
    if (!user?.access_token) {
      console.error('Отсутствует токен доступа')
      return
    }

    setIsProcessing(true)

    const outfitId = product.id // Идентификатор образа
    const url = 'https://istrongapp.com/api/users/wardrobe/' // Используйте правильный URL для покупки

    // Закрываем модалку немедленно после начала покупки
    handleCloseModal()

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ outfit_id: outfitId }), // Передаем данные правильно
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Образ успешно куплен:', data)

        setIsBought(true) // Обновляем локальное состояние для карточки

        handleChangeUserStore({
          user: {
            ...user,
            coins: data.balans, // Обновляем количество монет
          },
        })
      } else {
        const errorData = await response.json()
        console.error('Ошибка при покупке:', errorData) // Логирование ошибки от сервера
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error) // Логирование ошибок сети
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <motion.li
        className={styles.card}
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 0.9, y: 0 } : {}}
        transition={{ duration: 0.3 }}
        onClick={handleCardClick} // Открытие модалки при клике на карточку
      >
        <div className={styles.card__img_wrap}>
          <Image className={styles.card__img} src={product.image} alt={product.name} fill />

          {!isBought && (
            <div className={styles.card__overlay}>
              <IconLock />
            </div>
          )}
          {!isBought && (
            <CoinsDisplayComponent
              classPosition={styles.card__img_wrap_block}
              coin={product.price}
            />
          )}
        </div>
        <div className={styles.card__wrap_title}>
          <h3 className={`${styles.card__name} text-5`}>{product.name}</h3>
        </div>
      </motion.li>

      {/* Модалка для подтверждения покупки */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={handleCloseModal}>
              X
            </button>
            <h2>Купуємо?</h2>
            <div className={styles.card__img_wrap}>
              <Image className={styles.card__img} src={product.image} alt={product.name} fill />
              <div className={styles.card__overlay}>
                <IconLock />
              </div>
            </div>
            <div className={styles.modalButtons}>
              <button onClick={handlePurchase} disabled={isProcessing}>
                Так
              </button>
              <button onClick={handleCloseModal}>Ні</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductCardComponent
