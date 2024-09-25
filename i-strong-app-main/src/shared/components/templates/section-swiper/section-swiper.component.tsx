import Link from 'next/link'

import { Swiper, SwiperSlide } from 'swiper/react'

import { FC } from 'react'

import { IChallenge } from '@/interfaces/challenge'
import { ButtonComponent, SliderCardComponent } from '@/shared/components'

import styles from './section-swiper.module.scss'

type IInstructionData = {
  id: number
}

type ISlideData = IChallenge

interface ISectionSwiper {
  title: string
  data: ISlideData[] | null
  type: 'Challenge' | 'Instructions'
  status: string
}

//component
export const SectionSwiperComponent: FC<Readonly<ISectionSwiper>> = ({
  title,
  data,
  type,
  status,
}) => {
  console.log(data)
  if (status === 'pending' && data === null) {
    return <div>Loading...</div>
  }
  //return
  return (
    <section className={` ${styles.swiper}`}>
      <h2 className='text-3'>
        {title}
        {type === 'Challenge' && (
          <span className={styles.swiper__completed}>
            {' '}
            {
              data?.filter((slide) => slide?.is_completed || slide?.current_subtask?.is_completed)
                .length
            }
            /{data?.length}
          </span>
        )}
      </h2>
      {status === 'pending' ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.swiper__slider}>
          <div className={styles.swiper__slider_position}>
            <Swiper
              spaceBetween={8}
              slidesPerView={3}
              grabCursor={true}
              style={{ ...(type === 'Challenge' && { height: '19rem', paddingTop: '8px' }) }}
            >
              {data?.map((slide: ISlideData) => (
                <SwiperSlide key={slide?.id}>
                  <Link
                    className={styles.swiper__slider_card}
                    href={`challenge?id=${slide?.id}`}
                    key={slide?.id}
                  >
                    <SliderCardComponent slide={slide} />

                    {slide?.is_completed !== undefined && (
                      <ButtonComponent
                        size='small'
                        variant={
                          slide?.is_completed || slide?.current_subtask?.is_completed
                            ? 'filled'
                            : 'outlined'
                        }
                      >
                        {slide?.is_completed || slide?.current_subtask?.is_completed
                          ? ` Зроблено`
                          : `Зробити`}
                      </ButtonComponent>
                    )}
                  </Link>
                </SwiperSlide>
              ))}
              <SwiperSlide style={{ background: 'none' }} />
            </Swiper>
          </div>
        </div>
      )}
      {type === 'Instructions' && <ButtonComponent>Подивитися усі</ButtonComponent>}
    </section>
  )
}

export default SectionSwiperComponent
