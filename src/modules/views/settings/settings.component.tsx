'use client'
import { useRouter } from 'next/navigation'
import { FC, useState, useEffect } from 'react'
import { ButtonComponent, ContactInfoComponent, PageHeaderComponent } from '@/shared/components'
import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import ToggleBtnComponent from '@/shared/components/ui/toggle-btn/toggle-btn.component'
import { IconEdit } from '@/shared/icons'
import {
  scheduleNotifications,
  saveNotificationState,
  getNotificationState,
} from '@/utils/native-app/notifications'
import styles from './settings.module.scss'

// интерфейс
interface ISettings {}

// компонент
export const SettingsComponent: FC<Readonly<ISettings>> = () => {
  const router = useRouter()
  const [moodTrackerEnabled, setMoodTrackerEnabled] = useState<boolean>(false) // Начальное состояние
  const [otherNotificationsEnabled, setOtherNotificationsEnabled] = useState<boolean>(false) // Начальное состояние

  // Загрузка состояния уведомлений при загрузке компонента
  useEffect(() => {
    const loadNotificationState = async () => {
      const moodTrackerState = await getNotificationState() // Проверяем состояние уведомлений
      const otherNotificationsState = localStorage.getItem('otherNotifications') === 'true'

      setMoodTrackerEnabled(moodTrackerState)
      setOtherNotificationsEnabled(otherNotificationsState)
    }
    loadNotificationState()
  }, [])

  const handleResetRoit = () => {
    router.push('/settings/reset-password')
  }

  const handleDelete = () => {
    router.push('/account-deletion')
  }

  // Сохранение состояния Трекера настрою
  const handleToggleMoodTracker = async () => {
    const newState = !moodTrackerEnabled
    setMoodTrackerEnabled(newState)
    await saveNotificationState(newState) // Сохраняем состояние для Трекера настрою
    localStorage.setItem('moodTracker', JSON.stringify(newState)) // Сохраняем в localStorage
    await scheduleNotifications() // Перепланируем уведомления при изменении состояния
  }

  // Сохранение состояния для других уведомлений
  const handleToggleOtherNotifications = async () => {
    const newState = !otherNotificationsEnabled
    setOtherNotificationsEnabled(newState)
    await saveNotificationState(newState) // Сохраняем состояние для других уведомлений
    localStorage.setItem('otherNotifications', JSON.stringify(newState)) // Сохраняем в localStorage
    await scheduleNotifications() // Перепланируем уведомления при изменении состояния
  }

  // Return
  return (
    <section className={`${styles.settings} container`}>
      <PageHeaderComponent title={'Налаштування'} />

      <div className={styles.settings__cards}>
        <ContactInfoComponent balance={false} color={`BLUE`} />

        <div className={`${styles.settings_card} ${styles.green}`}>
          <div className={styles.settings_card__header}>
            <h2>Конфіденційність</h2>

            <IconButtonComponent name={'Edit'} onClick={handleResetRoit}>
              <IconEdit />
            </IconButtonComponent>
          </div>

          <div className={styles.settings_card__content}>
            <div className={styles.settings_card__field}>
              <span>Пароль для входу</span>
              <span className={styles.settings_card__field_value}>********</span>
            </div>

            <div className={styles.settings_card__field}>
              <span>Пароль для щоденника</span>
              <span className={styles.settings_card__field_value}>********</span>
            </div>
          </div>
        </div>

        <div className={`${styles.settings_card} ${styles.yellow}`}>
          <div className={styles.settings_card__header}>
            <h2>Звуки та сповіщення</h2>
          </div>

          <div className={styles.settings_card__content}>
            <div className={styles.settings_card__field}>
              <span>Трекер настрою</span>
              <ToggleBtnComponent
                isChecked={moodTrackerEnabled}
                onToggle={handleToggleMoodTracker}
              />
            </div>
            <div className={styles.settings_card__field}>
              <span>Інші сповіщення</span>
              <ToggleBtnComponent
                isChecked={otherNotificationsEnabled}
                onToggle={handleToggleOtherNotifications}
              />
            </div>
          </div>
        </div>
      </div>

      <ButtonComponent onClick={handleDelete}>Видалити аккаунт</ButtonComponent>
    </section>
  )
}

export default SettingsComponent
