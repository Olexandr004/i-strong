'use client'
import { FC } from 'react'
import ReactPlayer from 'react-player'

import styles from './video-tutorial.module.scss'

//interface
interface IVideoTutorial {}

//component
export const VideoTutorialComponent: FC<Readonly<IVideoTutorial>> = () => {
  //return
  return (
    <div className={styles.video_tutorial}>
      <div className={styles.video_tutorial__player}>
        <ReactPlayer
          url={
            'https://www.youtube.com/watch?v=URkDKyf9gVo&ab_channel=%D0%9F%D1%81%D0%B8%D1%85%D0%BE%D0%BB%D0%BE%D0%B3%D0%9E%D0%BA%D1%81%D0%B0%D0%BD%D0%B0%D0%AF%D0%BD%D1%87%D0%B0%D0%BA'
          }
          width='100%'
          height='100%'
        />
      </div>
    </div>
  )
}
export default VideoTutorialComponent
