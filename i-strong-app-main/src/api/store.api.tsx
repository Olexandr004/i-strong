import { useRequest } from '@/api/useRequest'

export const getGifts = async (token: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRequest(`shop/gifts/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getGiftDetails = async (token: string, giftId: number) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRequest(`shop/gifts/${giftId}/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const postPlaceOrder = async (
  token: string,
  giftId: number,
  userName: string,
  phoneNumber: string,
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRequest('shop/orders/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      gift_id: giftId,
      user: {
        name: userName,
        phone_number: phoneNumber,
      },
    },
  })
}

export const postAddToWishlist = async (token: string, giftId: number) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRequest('users/wishlist/', {
    method: 'POST',
    body: {
      gift_id: giftId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const deleteFromWishlist = async (token: string, giftId: number) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRequest(`users/wishlist/${giftId}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
