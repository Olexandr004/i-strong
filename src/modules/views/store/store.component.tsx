'use client'
import { useSearchParams } from 'next/navigation'

import { FC, useEffect, useRef } from 'react'

import {
  CoinsDisplayComponent,
  ModalGettingToInstructionsComponent,
  PageHeaderComponent,
  ProductCardComponent,
  ProductComponent,
  ScrollToTopButtonComponent,
} from '@/shared/components'
import { useGiftDetails, useGifts } from '@/shared/hooks/useStoreMutations'
import { ImageCapybaraHeart } from '@/shared/images'
import { useUserStore } from '@/shared/stores'

import styles from './store.module.scss'

interface IStoreComponent {}

//component
export const StoreComponent: FC<Readonly<IStoreComponent>> = () => {
  const searchParams = useSearchParams()
  const giftId = Number(searchParams.get('product'))
  const shopContainerRef = useRef(null)
  const { giftsMutate, status: statusGift, products } = useGifts()
  const { giftDetailsMutate, status, product } = useGiftDetails()
  const { user } = useUserStore()

  useEffect(() => {
    if (!giftId) {
      return giftsMutate()
    }
  }, [giftId])

  useEffect(() => {
    if (giftId) {
      return giftDetailsMutate(giftId)
    }
  }, [giftId])

  if (statusGift === 'pending' || status === 'pending') {
    return <div>Loading...</div>
  }

  return (
    <section className={`${styles.shop}`}>
      <div ref={shopContainerRef} className={styles.shop__scroll}>
        <PageHeaderComponent title={!giftId ? 'Подарунки' : 'Подарунок'} />
        {!giftId && (
          <div className={styles.shop__balance}>
            <div className={styles.shop__balance_block}>
              <p className='text-5-grey'>Баланс:</p>

              <CoinsDisplayComponent coin={user?.coins} />
            </div>
          </div>
        )}
        {!giftId ? (
          <ul className={`${styles.shop__gallery} gallery`}>
            {products.map((product) => (
              <ProductCardComponent key={product.id} product={product} />
            ))}
          </ul>
        ) : (
          product && <ProductComponent giftId={giftId} product={product} />
        )}
        <ScrollToTopButtonComponent scrollContainerRef={shopContainerRef} />
      </div>

      {/*<ModalGettingToInstructionsComponent*/}
      {/*  title='Раді вітати у найприємнішому місці застосунку! Тут ти зможеш замовити будь-який подарунок за зароблені монетки'*/}
      {/*  image={ImageCapybaraHeart}*/}
      {/*  buttonText='Супер!'*/}
      {/*  check={`shop`}*/}
      {/*/>*/}
    </section>
  )
}
export default StoreComponent
