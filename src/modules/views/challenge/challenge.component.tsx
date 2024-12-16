import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { FC, useCallback, useEffect, useMemo, useState, useRef } from 'react'

import { IChallengeData } from '@/interfaces/challenge'
import {
  BaseModalComponent,
  ButtonComponent,
  CoinsDisplayComponent,
  PageHeaderComponent,
} from '@/shared/components'
import { useChallengeById, useCompleteChallenge } from '@/shared/hooks/useChallengeMutations'
import { ImageCapybaraBook } from '@/shared/images'
import { useCommonStore } from '@/shared/stores'

import styles from './challenge.module.scss'

interface IChallengeComponent {}

export const ChallengeComponent: FC<Readonly<IChallengeComponent>> = () => {
  const searchParams = useSearchParams()
  const challenge_id = Number(searchParams.get('id'))
  const { challengeByIdMutate, status, challenge } = useChallengeById()
  const { isModalActive } = useCommonStore()
  const [note, setNote] = useState('')
  const { completeChallengePartMutate, statusCompleteChallenge } = useCompleteChallenge()

  const disableInteraction = useMemo(
    () =>
      challenge?.current_subtask?.is_completed ||
      challenge?.is_completed ||
      statusCompleteChallenge === 'success',
    [challenge, statusCompleteChallenge],
  )

  const isButtonDisabled = useMemo(
    () => disableInteraction || (challenge?.track_diary && note.length < 50),
    [disableInteraction, challenge, note],
  )

  const handleSubmit = useCallback(() => {
    const challengeSlide: IChallengeData = {
      challenge_id,
    }

    if (challenge?.current_subtask?.id != null) {
      challengeSlide.subtask_id = challenge.current_subtask.id
    }

    if (note) {
      // Send the note as is, preserving the newlines
      challengeSlide.note = note
    }
    console.log('Отправляем данные:', challengeSlide)

    completeChallengePartMutate(challengeSlide)
    useCommonStore.setState({ isModalActive: true })
  }, [challenge_id, challenge, note, completeChallengePartMutate])

  useEffect(() => {
    if (challenge_id) {
      return challengeByIdMutate(challenge_id)
    }
  }, [challenge_id])

  useEffect(() => {
    if (statusCompleteChallenge === 'success') {
      useCommonStore.setState({ isModalActive: false, activeChallengeTypeButton: 'completed' })
    }
  }, [statusCompleteChallenge])

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const handleFocus = () => {
    textareaRef.current?.focus()
    setTimeout(() => {
      textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  if (status === 'pending' && !challenge) {
    return <div>Loading...</div>
  }

  if (!challenge) {
    return <div>Oшибка</div>
  }
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const cleanedValue = e.target.value.replace(/ {3,}/g, '  ')
    setNote(cleanedValue)
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  return (
    <section className={`${styles.challenge} container`}>
      <PageHeaderComponent title='Челендж' />
      <div>
        <h2 className={`${styles.challenge__title} text-2`}>{challenge.title}</h2>
        <ul className={styles.challenge__rewards}>
          <li className={styles.challenge__rewards_block}>
            <p className='text-4'>Тривалість</p> <p className='text-6'>{challenge.duration} день</p>
          </li>
          <li className={styles.challenge__rewards_block}>
            <p className='text-4'>Монетки</p> <p className='text-6'>+{challenge.points}</p>
          </li>
          {challenge.bonus && (
            <li className={styles.challenge__rewards_block}>
              <p className='text-4'>Бонус за завершення</p>
              <p className='text-6'>+{challenge.bonus}</p>
            </li>
          )}
        </ul>
      </div>

      <div>
        {challenge.current_subtask?.day_number && (
          <div className={styles.challenge__progressbar}>
            <div className={styles.challenge__progressbar_info}>
              <h3 className={`text-3`}>
                День {challenge.current_subtask?.day_number}/{challenge.duration}
              </h3>
              <CoinsDisplayComponent coin={challenge.current_subtask?.points} />
            </div>
            <div className={styles.challenge__progressbar_line}>
              <div
                className={styles.challenge__progressbar_span}
                style={{
                  width: `${(challenge.current_subtask?.day_number / challenge.duration) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {challenge.track_diary &&
          (disableInteraction ? (
            <p className={`text-2 text-cent`}>Ти вже виконав цей челедж </p>
          ) : (
            <div className={styles.challenge__area}>
              <label htmlFor='challenge-impressions' className={`text-4`}>
                {challenge.current_subtask?.description}
              </label>
              <textarea
                ref={textareaRef}
                id='challenge-impressions'
                className={`text-5 ${styles.challenge__area_input}`}
                value={note}
                onChange={handleInput}
                onFocus={handleFocus}
                disabled={disableInteraction}
              />
              <p className={`text-4-grey`}>*50+ символів</p>
            </div>
          ))}
      </div>

      <div>
        <ButtonComponent
          disabled={isButtonDisabled}
          onClick={() => useCommonStore.setState({ isModalActive: true })}
        >
          Виконати
        </ButtonComponent>
      </div>

      {isModalActive && (
        <BaseModalComponent>
          <div className={styles.modal}>
            <h2 className={`title`}>Так тримати!</h2>
            <div className={`${styles.modal__text} text-2`}>
              Ти отримав
              {
                <CoinsDisplayComponent
                  coin={
                    challenge.current_subtask?.points
                      ? challenge.current_subtask?.points
                      : challenge.points
                  }
                />
              }{' '}
              за виконання завдання
            </div>
            <div className={styles.modal__top_img}>
              <Image
                src={ImageCapybaraBook}
                alt='Modal Image'
                sizes='90vw'
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
            <ButtonComponent onClick={handleSubmit}>Круто!</ButtonComponent>
          </div>
        </BaseModalComponent>
      )}
    </section>
  )
}

export default ChallengeComponent
