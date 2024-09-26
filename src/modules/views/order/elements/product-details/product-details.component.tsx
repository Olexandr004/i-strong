import Image from 'next/image'

import { FC } from 'react'

import { IProduct } from '@/interfaces/store-interface'
import { IconCoin } from '@/shared/icons'

import styles from './product-details.module.scss'

interface IProductDetails {
  product: IProduct
}
const ProductDetailsComponent: FC<IProductDetails> = ({ product }) => (
  <div className={styles.details}>
    <div className={styles.details__image}>
      <Image src={product.main_image} alt={product.name} fill priority />
    </div>

    <div>
      <h2 className={`${styles.details__title} text-4`}>{product.name}</h2>

      <div className={styles.details__priceContainer}>
        <div className={styles.details__priceContainer_svg}>
          <IconCoin />
        </div>
        <p className={styles.details__priceContainer_price}>{product.price}</p>
      </div>
    </div>
  </div>
)

export default ProductDetailsComponent
