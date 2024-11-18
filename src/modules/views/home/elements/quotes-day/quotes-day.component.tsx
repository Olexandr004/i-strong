import Image from 'next/image'
import { FC, useMemo } from 'react'

import { useGetQuery } from '@/api/daily-quote'
import { useUserStore } from '@/shared/stores'

import styles from './quotes-day.module.scss'

interface IQuotesDay {}

export const QuotesDayComponent: FC<IQuotesDay> = () => {
  const { user } = useUserStore()
  const token = useMemo(() => user?.access_token || '', [user])

  const { data, error, isLoading } = useGetQuery(token)

  return (
    <section className={styles.quotes}>
      <h3 className={`text-3 ${styles.quotes__title}`}>Цитата дня</h3>

      <div className={styles.quotes__content}>
        {/* Текст */}
        <div className={`text-4 ${styles.quotes__content_text}`}>
          {isLoading
            ? 'Завантаження цитати...'
            : error
              ? 'Помилка завантаження'
              : (data as any).quote}
        </div>

        {/* Изображение */}
        <div className={styles.quotes__img}>
          <Image
            src={'/image/capybara-chill.png'}
            alt={`Capybara`}
            width={400}
            height={200}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            priority
          />
        </div>
      </div>
    </section>
  )
}

export default QuotesDayComponent
