'use client'
import Image from 'next/image'

import 'swiper/css/pagination'
import 'swiper/css/effect-creative'
import { Autoplay, EffectCreative, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { SwiperRef } from 'swiper/swiper-react'

import { FC, useState } from 'react'

import {
  ImageSwiper1,
  ImageSwiper2,
  ImageSwiper3,
  ImageSwiper4,
  ImageSwiper5,
} from '@/shared/images'

import styles from './photo-tutorial.module.scss'

const swiperPhotos = [
  { src: ImageSwiper1, key: 1 },
  { src: ImageSwiper2, key: 2 },
  { src: ImageSwiper3, key: 3 },
  { src: ImageSwiper4, key: 4 },
  { src: ImageSwiper5, key: 5 },
]

//interface
interface IPhotoTutorial {
  array: any
}

//component
export const PhotoTutorialComponent: FC<Readonly<IPhotoTutorial>> = ({ array }) => {
  const [, setSwiper] = useState<SwiperRef['swiper'] | null>(null)
  console.log(array)
  //return
  return (
    <div className={styles.photo_tutorial}>
      <Swiper
        className={styles.photo_tutorial__swiper}
        onSwiper={(s) => setSwiper(s)}
        direction={'horizontal'}
        modules={[Autoplay, Pagination, EffectCreative]}
        slidesPerView={1}
        effect={'fade'}
        pagination={{ clickable: true }}
        wrapperClass={styles.photo_tutorial__swiper_wrapper}
        speed={500}
        loop={true}
      >
        {array.map((product: any) => (
          <SwiperSlide key={product.key} className={styles.photo_tutorial__slide}>
            <div className={styles.photo_tutorial__image}>
              <Image
                src={product.image}
                alt={'IStrong'}
                fill
                sizes={'(max-width: 768px) 30vw, 25vw'}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
export default PhotoTutorialComponent
