import Image from 'next/image'

import { IChallenge } from '@/interfaces/challenge'
import { IconFlag } from '@/shared/icons'
import { ImageCapybara, ImageCapybaraCap, ImageCapybaraTeacher } from '@/shared/images'

import { CoinsDisplayComponent } from '../../ui/coins-display'

import styles from './slider-card.module.scss'

type IInstructionData = {
  id?: number
  // title: string
  // content: string
  // completed: boolean
}

type ISlideData = IChallenge | IInstructionData

type ISliderCard = {
  slide: ISlideData
}

const colorAvatarPairs = [
  { color: '#FFF1B6', avatar: '/image/back-ch-1.png' },
  { color: '#C0D6A6', avatar: '/image/back-ch-2.png' },
  { color: '#C0EBF1', avatar: '/image/back-ch-3.png' },
]

const getRandomColorAndAvatar = () => {
  const randomIndex = Math.floor(Math.random() * colorAvatarPairs.length)
  return colorAvatarPairs[randomIndex]
}

const SliderCardComponent: React.FC<ISliderCard> = ({ slide }) => {
  if (!slide) {
    return null
  }
  const { title, type, points } = slide as IChallenge
  const { color, avatar } = getRandomColorAndAvatar()
  return (
    <div className={styles.card} style={{ backgroundColor: color }}>
      <h3 className={`text-6 ${styles.card_title}`}>{title}</h3>
      {type === `long_term` && (
        <div className={styles.card_icon}>
          <IconFlag />
        </div>
      )}
      <div className={styles.card__avatar}>
        <div className={styles.card__avatar_position}>
          <Image src={avatar} alt={title} fill />
        </div>
      </div>
      <CoinsDisplayComponent coin={points} />
    </div>
  )
}

export default SliderCardComponent
