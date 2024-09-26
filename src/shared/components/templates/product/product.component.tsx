import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { DescriptionProductComponent } from './description'

import { FC, useState } from 'react'

import { IProductComponent } from '@/interfaces/store-interface'
import useFavorite from '@/shared/hooks/useFavorite'
import { IconCoin, IconHeart } from '@/shared/icons'
import { useUserStore } from '@/shared/stores'

import { ButtonComponent } from '../../ui'

import styles from './product.module.scss'

const ProductComponent: FC<IProductComponent> = ({ giftId, product }) => {
  const router = useRouter()
  const { id, is_favorite, images, main_image, name, price } = product
  const { isFavorite, handleFavorite } = useFavorite(giftId, is_favorite)
  const { user } = useUserStore()

  const handleOrderClick = () => {
    router.push(`/order?product=${id}`)
  }
  const [selectedImage, setSelectedImage] = useState(main_image)
  const imageList = [main_image, ...images.map((img) => img.image)].filter(
    (img) => img !== selectedImage,
  )

  const handleThumbnailClick = (imageSrc: string) => {
    setSelectedImage(imageSrc)
  }

  return (
    <div className={styles.product}>
      <h2 className={`${styles.product__title} text-6`}>{name}</h2>
      <div
        className={`${styles.product__imageContainer} ${imageList.length === 0 ? styles.product__imageContainer_one : ''}`}
      >
        <div className={styles.product__imageContainer__mainImage}>
          <Image className={styles.img} src={selectedImage} alt={name} layout='fill' priority />
        </div>

        {imageList.length > 1 && (
          <ul className={styles.product__imageContainer__imageList}>
            {imageList.map((imgSrc, i) => (
              <li
                key={i}
                className={styles.product__imageContainer__imageList__item}
                onClick={() => handleThumbnailClick(imgSrc)}
              >
                <Image className={styles.img} src={imgSrc} alt={name} layout='fill' priority />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.product__favorite}>
        <div className={styles.product__favorite_priceContainer}>
          <div className={styles.product__favorite_priceContaine_svg}>
            <IconCoin />
          </div>
          <span className={styles.product__favorite_priceContaine_price}>{price}</span>
        </div>
        <button className={styles.product__favorite_btn} onClick={handleFavorite}>
          <IconHeart
            className={`${styles.product__favorite_svg} ${isFavorite && styles.product__favorite_active}`}
          />
        </button>
      </div>

      <ButtonComponent
        type='submit'
        disabled={(user?.coins ?? 0) < price}
        onClick={handleOrderClick}
      >
        Замовити
      </ButtonComponent>
      <DescriptionProductComponent product={product} />
    </div>
  )
}

export default ProductComponent
