import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

import { IProductCard } from '@/interfaces/store-interface'
import { IconLock } from '@/shared/icons'
import { useUserStore, useCommonStore } from '@/shared/stores'
import { ButtonComponent } from '@/shared/components'

import { CoinsDisplayComponent } from '../../ui/coins-display'

import styles from './product-card.module.scss'

const ProductCardComponent: React.FC<
  IProductCard & {
    selectedCard: string | number | null
    onSetMainImage: (image: string) => void
    onCardClick: (id: string) => void
  }
> = ({ product, selectedCard, onSetMainImage, onCardClick }) => {
  const { user, handleChangeUserStore } = useUserStore()
  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isBought, setIsBought] = useState(product.is_bought)

  // Состояние для отображения ошибки
  const [errorText, setErrorText] = useState('')

  const handleCardClick = async () => {
    // Если текущая карточка уже активная, сбрасываем её на первую карточку
    if (selectedCard === product.id) {
      onCardClick(product.id.toString())
      return
    }

    // Иначе делаем текущую карточку активной
    onCardClick(product.id.toString())

    // Проверяем, хватает ли монет для покупки только для не купленных товаров
    if (!isBought && (user?.coins ?? 0) < product.price) {
      // Если монет недостаточно, показываем ошибку через тостер
      setErrorText('Недостатньо монеток')
      handleChangeCommonStore({ errorText: 'Недостатньо монеток' })

      // Ожидаем 1 секунду, чтобы скрыть ошибку
      setTimeout(() => {
        setErrorText('')
        handleChangeCommonStore({ errorText: '' })
      }, 1000)

      return
    }

    if (!isBought) {
      setIsModalOpen(true)
      return
    }

    try {
      const token = user?.access_token
      const response = await fetch('https://istrongapp.com/api/users/wardrobe/select/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ outfit_id: product.id }),
      })

      if (response.ok) {
        onSetMainImage(product.image)
      } else {
        console.error('Failed to set main image')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handlePurchase = async () => {
    if (!user?.access_token) return

    setIsProcessing(true)

    try {
      const response = await fetch('https://istrongapp.com/api/users/wardrobe/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ outfit_id: product.id }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsBought(true)
        handleChangeUserStore({
          user: { ...user, coins: data.balans },
        })
        onSetMainImage(product.image) // Устанавливаем изображение после покупки
        setIsModalOpen(false)
      } else {
        console.error('Error purchasing product')
      }
    } catch (error) {
      console.error('Error:', error)
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
        onClick={handleCardClick}
      >
        <div className={styles.card__img_wrap}>
          <Image
            className={`${styles.card__img} ${selectedCard === product.id && isBought ? styles.active : ''}`}
            src={product.image}
            alt={product.name}
            fill
          />
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

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div style={{ padding: '0 30px' }}>
              <h2>Купуємо?</h2>
              <div className={styles.card__img_wrap}>
                <Image
                  className={`${styles.card__img} ${selectedCard === product.id && isBought ? styles.active : ''}`}
                  src={product.image}
                  alt={product.name}
                  fill
                />
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
            </div>
            <div className={styles.modalButtons}>
              <ButtonComponent size={'regular'} onClick={handlePurchase} disabled={isProcessing}>
                Так
              </ButtonComponent>
              <ButtonComponent
                size={'regular'}
                variant={'outlined'}
                onClick={() => setIsModalOpen(false)}
              >
                Ні
              </ButtonComponent>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductCardComponent
