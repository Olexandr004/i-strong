import { useMutation } from '@tanstack/react-query'

import { useState } from 'react'

import { IOrderDetails, IProduct } from '@/interfaces/store-interface'
import { useUserStore } from '@/shared/stores'

import {
  deleteFromWishlist,
  getGiftDetails,
  getGifts,
  postAddToWishlist,
  postPlaceOrder,
} from '../../api/store.api'

interface UseGiftDetailsReturn {
  giftDetailsMutate: (giftId: number) => void
  status: 'idle' | 'pending' | 'success' | 'error'
  product: IProduct | null
}

const handleError = (error: Error) => {
  console.log(`Error: ${error.message}`)
}

export const useGifts = () => {
  const [products, setProducts] = useState<IProduct[]>([])
  const { user } = useUserStore()
  const token = user?.access_token || ''
  const { mutate: giftsMutate, status } = useMutation({
    mutationFn: () => {
      return getGifts(token)
    },
    onSuccess: (data: any) => {
      setProducts(data)
    },
    onError: handleError,
  })
  return { giftsMutate, status, products }
}

export const useGiftDetails = (): UseGiftDetailsReturn => {
  const { user } = useUserStore()
  const token = user?.access_token || ''
  const [product, setProduct] = useState<IProduct | null>(null)
  const { mutate: giftDetailsMutate, status } = useMutation({
    mutationFn: (giftId: number) => {
      return getGiftDetails(token, giftId)
    },
    onSuccess: (data) => {
      if (data) {
        setProduct(data as IProduct)
      } else {
        setProduct(null)
      }
    },
    onError: handleError,
  })
  return { giftDetailsMutate, status, product }
}

export const useOrder = () => {
  const { user, handleChangeUserStore } = useUserStore()
  const [isOrderPlaced, setOrderPlaced] = useState(false)
  const token = user?.access_token || ''
  const {
    mutate: placeOrderMutate,
    status: orderStatus,
    error: orderError,
  } = useMutation({
    mutationFn: (order: IOrderDetails) => {
      const { gift_id, name, phone_number } = order
      return postPlaceOrder(token, gift_id, name, phone_number)
    },
    onSuccess: (data: any) => {
      setOrderPlaced(true)
      if (data && data.balans !== undefined) {
        if (user) {
          handleChangeUserStore({ user: { ...user, coins: data.balans } })
        }
      }
    },
    onError: handleError,
  })

  return { placeOrderMutate, orderStatus, orderError, isOrderPlaced }
}

export const useAddToWishlist = () => {
  const { user } = useUserStore()
  const token = user?.access_token || ''
  const {
    mutate: addToWishlist,
    status: wishlistAddStatus,
    error: wishlistAddError,
  } = useMutation({
    mutationFn: (giftId: number) => {
      return postAddToWishlist(token, giftId)
    },
    onSuccess: () => {},
    onError: handleError,
  })

  return { addToWishlist, wishlistAddStatus, wishlistAddError }
}

export const useRemoveFromWishlist = () => {
  const { user } = useUserStore()
  const token = user?.access_token || ''

  const {
    mutate: removeWishlist,
    status: wishlistRemoveStatus,
    error: wishlistRemoveError,
  } = useMutation({
    mutationFn: (giftId: number) => {
      return deleteFromWishlist(token, giftId)
    },
    onSuccess: () => {},
    onError: handleError,
  })

  return { removeWishlist, wishlistRemoveStatus, wishlistRemoveError }
}
