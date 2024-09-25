import { useSearchParams } from 'next/navigation'

import { OrderSuccessComponent, ProductDetailsComponent } from './elements'

import { FC, useEffect, useState } from 'react'

import { IOrderDetails } from '@/interfaces/store-interface'
import { ButtonComponent, ContactInfoComponent, PageHeaderComponent } from '@/shared/components'
import { useGiftDetails, useOrder } from '@/shared/hooks/useStoreMutations'
import { useUserStore } from '@/shared/stores'

import styles from './order.module.scss'

interface IOrderComponent {}

export const OrderComponent: FC<Readonly<IOrderComponent>> = () => {
  const searchParams = useSearchParams()
  const giftId = Number(searchParams.get('product'))

  const { giftDetailsMutate, status, product } = useGiftDetails()
  const { placeOrderMutate, isOrderPlaced } = useOrder()

  const { user } = useUserStore()
  const [userData, setUserData] = useState({
    username: user?.name,
    phone_number: user?.phone_number,
  })
  useEffect(() => {
    if (giftId) {
      return giftDetailsMutate(giftId)
    }
  }, [giftId])

  const handleOrder = () => {
    if (!userData.username || !userData.phone_number) {
      return
    }

    const order: IOrderDetails = {
      gift_id: giftId,
      name: userData.username,
      phone_number: userData.phone_number,
    }

    placeOrderMutate(order)
  }

  if (status === 'pending') {
    return <div>Loading...</div>
  }
  if (status === 'error' || !product) {
    return <div>Подарунок не знайдено або його немає в наявості</div>
  }
  if (isOrderPlaced) {
    return <OrderSuccessComponent />
  }

  return (
    <section className={`${styles.order} container`}>
      <div className={`${styles.order__wrap}`}>
        <PageHeaderComponent title={'Замовлення'} />

        <ProductDetailsComponent product={product} />

        <ContactInfoComponent
          balance={true}
          color={`GRAU`}
          userData={userData}
          setUserData={setUserData}
        />
      </div>

      <ButtonComponent type='submit' onClick={handleOrder}>
        Замовити
      </ButtonComponent>
    </section>
  )
}
export default OrderComponent
