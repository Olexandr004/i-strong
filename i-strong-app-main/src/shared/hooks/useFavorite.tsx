import { useEffect, useState } from 'react'

import { useAddToWishlist, useRemoveFromWishlist } from '@/shared/hooks/useStoreMutations'

function useFavorite(giftId: number, initialFavorite: boolean) {
  const { addToWishlist } = useAddToWishlist()
  const { removeWishlist } = useRemoveFromWishlist()
  const [isFavorite, setIsFavorite] = useState(initialFavorite)

  useEffect(() => {
    setIsFavorite(initialFavorite)
  }, [initialFavorite])

  const handleFavorite = async () => {
    setIsFavorite((current) => !current)
    try {
      if (!isFavorite) {
        await addToWishlist(giftId)
      } else {
        await removeWishlist(giftId)
      }
    } catch (error) {
      setIsFavorite((current) => !current)
    }
  }

  return { isFavorite, handleFavorite }
}

export default useFavorite
