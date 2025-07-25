'use client'
import { request } from '@/api/useRequest'

export const getGifts = async (token: string, bought?: boolean) => {
  const queryParams = bought !== undefined ? `?bought=${bought}` : ''
  const url = `https://istrongapp.com/api/users/wardrobe${queryParams}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.outfits || []
  } catch (error) {
    console.error('Failed to fetch outfits:', error)
    throw error
  }
}

export const getGiftDetails = async (token: string, giftId: number) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return request(`shop/gifts/${giftId}/`, {
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
  return request('shop/orders/', {
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
  return request('users/wishlist/', {
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
  return request(`users/wishlist/${giftId}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
