import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { FC } from 'react'

import { ButtonComponent } from '@/shared/components'
import { ImageCapybaraBook } from '@/shared/images'

import styles from './order-success.module.scss'

interface OrderSuccessComponentProps {}

export const OrderSuccessComponent: FC<OrderSuccessComponentProps> = () => {
  const router = useRouter()

  const finalizeOrder = () => {
    router.push('/store')
  }

  return (
    <section className={`${styles.success} container`}>
      <div>
        <h1 className={`title`}>Замовлення успішно оформлено</h1>
        <div className={styles.success__wrap}>
          <Image
            src={ImageCapybaraBook}
            alt={`Capybara`}
            sizes={'90vw'}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            priority
          />
        </div>
      </div>
      <ButtonComponent type='button' onClick={finalizeOrder}>
        Завершити
      </ButtonComponent>
    </section>
  )
}

export default OrderSuccessComponent
