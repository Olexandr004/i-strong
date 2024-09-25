import Image from 'next/image'
import Link from 'next/link'

import { FC } from 'react'

import { IFavoriteCardComponent } from '@/interfaces/store-interface'
import { IconHeart } from '@/shared/icons'

import { CoinsDisplayComponent } from '../../ui'

import styles from './favorite-card.module.scss'

const FavoriteCardComponent: FC<IFavoriteCardComponent> = ({ product, handleFavorite }) => {
  const { id, name, main_image, is_favorite, price } = product

  return (
    <Link href={`/store?product=${id}`} className={styles.favorite__list_item}>
      <div className={styles.favorite__list_item_img}>
        <Image src={main_image} alt={name} fill priority />
      </div>
      <div className={styles.favorite__list_item_info}>
        <h2 className={`${styles.favorite__list_item_info_title} text-5`}>{name}</h2>
        <div className={styles.favorite__list_item_info_wrap}>
          <CoinsDisplayComponent coin={price} />
          <button
            className={styles.favorite__list_item_info_btn}
            onClick={(e) => {
              e.preventDefault()
              handleFavorite(id)
            }}
          >
            <IconHeart
              className={`${styles.favorite__list_item_info_heart} ${is_favorite && styles.favorite__list_item_info_heart_active}`}
            />
          </button>
        </div>
      </div>
    </Link>
  )
}

export default FavoriteCardComponent
