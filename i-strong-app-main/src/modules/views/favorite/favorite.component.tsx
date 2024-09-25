import { FC, useEffect } from 'react'

import { CoinsDisplayComponent, PageHeaderComponent } from '@/shared/components'
import FavoriteCardComponent from '@/shared/components/templates/favorite-card/favorite-card.component'
import { useGifts, useRemoveFromWishlist } from '@/shared/hooks/useStoreMutations'
import { useUserStore } from '@/shared/stores'

import styles from './favorite.module.scss'

interface IFavoriteComponent {}

export const FavoriteComponent: FC<IFavoriteComponent> = () => {
  const { user } = useUserStore()
  const { giftsMutate, products } = useGifts()
  const { removeWishlist } = useRemoveFromWishlist()

  const handleFavorite = async (productId: number) => {
    await removeWishlist(productId)
    giftsMutate()
  }
  useEffect(() => {
    giftsMutate()
  }, [products])
  return (
    <section className={`${styles.favorite} container`}>
      <PageHeaderComponent title='Віш-ліст' />
      <div className={styles.favorite__balance}>
        <p className={styles.text_5_grey}>Баланс:</p>
        <CoinsDisplayComponent coin={user?.coins} />
      </div>
      <div className={styles.favorite__list}>
        {products
          .filter((product) => product.is_favorite)
          .map((product) => (
            <FavoriteCardComponent
              key={product.id}
              product={product}
              handleFavorite={handleFavorite}
            />
          ))}
      </div>
    </section>
  )
}

export default FavoriteComponent
