export interface Image {
  image: string
}

export interface IProduct {
  id: number
  price: number
  name: string
  main_image: string
  is_favorite: boolean
  images: Image[]
  description: string
  features?: Feature[]
}

export interface IProductComponent {
  giftId: number
  product: IProduct
}

export interface Feature {
  name: string
  value: string
}

export interface IDescriptionProductComponent {
  product: {
    description?: string
    features?: Feature[]
  }
}

export interface IProductCard {
  product: IProduct
}
export interface IFavoriteCardComponent {
  product: IProduct
  handleFavorite: (id: number) => any
}

export interface IOrderComponent {
  product: IProduct
}

export interface IOrderDetails {
  gift_id: number
  name: string
  phone_number: string
}
