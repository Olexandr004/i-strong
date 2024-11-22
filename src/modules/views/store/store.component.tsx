'use client'
import { useSearchParams } from 'next/navigation'
import { FC, useEffect, useRef, useState } from 'react'

import {
  CoinsDisplayComponent,
  PageHeaderComponent,
  ProductCardComponent,
  ProductComponent,
  ScrollToTopButtonComponent,
} from '@/shared/components'
import { useGiftDetails, useGifts } from '@/shared/hooks/useStoreMutations'
import { useUserStore } from '@/shared/stores'

import styles from './store.module.scss'

interface IStoreComponent {}

export const StoreComponent: FC<Readonly<IStoreComponent>> = () => {
  const searchParams = useSearchParams()
  const giftId = Number(searchParams.get('product'))
  const shopContainerRef = useRef(null)
  const { giftsMutate, status: statusGift, products } = useGifts()
  const { giftDetailsMutate, status, product } = useGiftDetails()
  const { user } = useUserStore()
  const [selectedCard, setSelectedCard] = useState<number | null>(null) // Changed to number | null to represent selected product ID

  // State for active tab
  const [activeTab, setActiveTab] = useState<'all' | 'bought'>('all')

  // State for main image
  const [mainImage, setMainImage] = useState<string | null>(null)

  // Default image
  const defaultImage = '/image/default-capi.png'

  // Load saved image on mount
  useEffect(() => {
    const savedImage = localStorage.getItem('mainImage')
    if (savedImage) {
      setMainImage(savedImage)
    } else {
      setMainImage(defaultImage)
    }
  }, [])

  // Save selected image to localStorage
  const handleSetMainImage = (image: string) => {
    // Если картинка уже установлена как главная, сбрасываем на дефолтное изображение
    if (image === mainImage) {
      setMainImage(defaultImage) // Устанавливаем дефолтное изображение
      localStorage.setItem('mainImage', defaultImage) // Сохраняем дефолтное изображение в localStorage
    } else {
      setMainImage(image) // Устанавливаем новое изображение как главное
      localStorage.setItem('mainImage', image) // Сохраняем новое изображение в localStorage
    }
  }

  useEffect(() => {
    const savedSelectedCard = localStorage.getItem('selectedCard')
    if (savedSelectedCard) {
      setSelectedCard(Number(savedSelectedCard))
    }
  }, [])

  // Сохранение выбранной карточки в localStorage
  useEffect(() => {
    if (selectedCard !== null) {
      localStorage.setItem('selectedCard', selectedCard.toString())
    }
  }, [selectedCard])

  useEffect(() => {
    if (!giftId) {
      giftsMutate()
    }
  }, [giftId])

  useEffect(() => {
    if (giftId) {
      giftDetailsMutate(giftId)
    }
  }, [giftId])

  // Перезагрузка списка продуктов при смене вкладки
  useEffect(() => {
    if (!giftId) {
      giftsMutate() // Перезагружаем все продукты при смене вкладки
    }
  }, [activeTab, giftId]) // Следим за изменением вкладки или giftId

  if (statusGift === 'pending' || status === 'pending') {
    return <div>Loading...</div>
  }

  // Filter products based on active tab
  const filteredProducts =
    activeTab === 'all' ? products : products.filter((product) => product.is_bought === true)

  return (
    <section className={`${styles.shop}`}>
      <div ref={shopContainerRef} className={styles.shop__scroll}>
        <PageHeaderComponent title={!giftId ? 'Капі Fashion' : 'Подарунок'} />

        {!giftId && (
          <div className={styles.shop__balance}>
            <div className={styles.shop__balance_block}>
              <p className='text-5-grey'>Баланс:</p>
              <CoinsDisplayComponent coin={user?.coins} />
            </div>
          </div>
        )}

        {/* Main Image Display */}
        <div className={styles.shop__main_image}>
          <img src={mainImage || defaultImage} alt='Main Product' />
        </div>

        {/* Tabs */}
        {!giftId && (
          <div className={styles.shop__tabs}>
            <button
              className={`${styles.shop__tab} ${activeTab === 'all' ? styles.shop__tab_active : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Усі
            </button>
            <button
              className={`${styles.shop__tab} ${activeTab === 'bought' ? styles.shop__tab_active : ''}`}
              onClick={() => setActiveTab('bought')}
            >
              Придбані
            </button>
          </div>
        )}

        {/* Product List */}
        {!giftId ? (
          <ul className={`${styles.shop__gallery} gallery`}>
            {filteredProducts.map((product) => (
              <ProductCardComponent
                key={product.id}
                product={product}
                onSetMainImage={handleSetMainImage}
                selectedCard={selectedCard} // Передаем ID выбранной карточки
                onCardClick={() => setSelectedCard(product.id)} // Устанавливаем выбранную карточку
              />
            ))}
          </ul>
        ) : (
          product && <ProductComponent giftId={giftId} product={product} />
        )}

        <ScrollToTopButtonComponent scrollContainerRef={shopContainerRef} />
      </div>
    </section>
  )
}

export default StoreComponent
