import Image from 'next/image'
import Link from 'next/link'

import { motion } from 'framer-motion'

import { useInView } from 'react-intersection-observer'

import { IProductCard } from '@/interfaces/store-interface'
import useFavorite from '@/shared/hooks/useFavorite'
import { IconHeart } from '@/shared/icons'
import { useUserStore } from '@/shared/stores'

import { CoinsDisplayComponent } from '../../ui/coins-display'

import styles from './product-card.module.scss'

const ProductCardComponent: React.FC<IProductCard> = ({ product }) => {
  const { isFavorite, handleFavorite } = useFavorite(product.id, product.is_favorite)
  const { user } = useUserStore()

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  })

  return (
    <motion.li
      className={styles.card}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/store?product=${product.id}`}>
        <div className={`${styles.card__img_wrap}`}>
          <Image className={styles.card__img} src={product.main_image} alt={product.name} fill />
          {(user?.coins ?? 0) < product.price && (
            <div className={styles.card__img_wrap_background}>
              <p>Недостатньо монеток</p>
            </div>
          )}
          <CoinsDisplayComponent classPosition={styles.card__img_wrap_block} coin={product.price} />
        </div>
      </Link>
      <div className={styles.card__wrap_title}>
        <h3 className={`${styles.card__name} text-5`}>{product.name}</h3>
        <button className={styles.card__btn} onClick={handleFavorite}>
          <IconHeart
            className={`${styles.card__icon_basket} ${isFavorite && styles.card__active}`}
          />
        </button>
      </div>
    </motion.li>
  )
}

export default ProductCardComponent
