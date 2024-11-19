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

  // State for active tab
  const [activeTab, setActiveTab] = useState<'all' | 'bought'>('all')

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

        {/* Tabs */}
        {!giftId && (
          <div className={styles.shop__tabs}>
            <button
              className={`${styles.shop__tab} ${
                activeTab === 'all' ? styles.shop__tab_active : ''
              }`}
              onClick={() => setActiveTab('all')}
            >
              Усі
            </button>
            <button
              className={`${styles.shop__tab} ${
                activeTab === 'bought' ? styles.shop__tab_active : ''
              }`}
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
              <ProductCardComponent key={product.id} product={product} />
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
