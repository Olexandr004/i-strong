'use client'
import { useRouter } from 'next/navigation'
import { FC, useState, useEffect } from 'react'
import { ButtonComponent, ContactInfoComponent, PageHeaderComponent } from '@/shared/components'
import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import ToggleBtnComponent from '@/shared/components/ui/toggle-btn/toggle-btn.component'
import { IconEdit } from '@/shared/icons'
import { useUserStore } from '@/shared/stores'
import {
  notifications,
  scheduleNotifications,
  cancelNotifications,
  getNotificationState,
  saveNotificationState,
} from '@/utils/native-app/notifications' // Импортируйте ваши функции
import { PushNotifications } from '@capacitor/push-notifications'
import styles from './settings.module.scss'

interface ISettings {}

export const SettingsComponent: FC<Readonly<ISettings>> = () => {
  const router = useRouter()
  const { user, handleChangeUserStore } = useUserStore()

  const [moodTrackerEnabled, setMoodTrackerEnabled] = useState<boolean>(false)
  const [challengeNotificationsEnabled, setChallengeNotificationsEnabled] = useState<boolean>(false)

  const checkNotificationPermission = async () => {
    const permissionStatus = await PushNotifications.checkPermissions()
    if (permissionStatus.receive === 'granted') {
      setMoodTrackerEnabled(true)
      setChallengeNotificationsEnabled(true)
    } else {
      setMoodTrackerEnabled(false)
      setChallengeNotificationsEnabled(false)
    }
  }
  // Функция для загрузки состояния уведомлений с сервера
  const fetchNotificationPreferences = async (token: string) => {
    const response = await fetch('https://istrongapp.com/api/users/profile/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch notification preferences: ${response.status}`)
    }

    return await response.json()
  }

  // Функция для обновления настроек уведомлений на сервере
  const updateNotificationPreferences = async (
    token: string,
    moodSurvey: boolean,
    challenges: boolean,
  ) => {
    const response = await fetch(
      'https://istrongapp.com/api/users/profile/notifications-preferences/',
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood_survey: moodSurvey,
          challenges: challenges,
        }),
      },
    )

    if (!response.ok) {
      throw new Error('Failed to update notification preferences')
    }

    return await response.json()
  }

  // Загрузка состояния уведомлений при инициализации
  useEffect(() => {
    const loadNotificationStates = async () => {
      if (user?.access_token) {
        try {
          const preferences = await fetchNotificationPreferences(user.access_token)
          setMoodTrackerEnabled(preferences.notifications_preferences.mood_survey)
          setChallengeNotificationsEnabled(preferences.notifications_preferences.challenges)
        } catch (error) {
          console.error('Error loading notification states:', error)
        }
      }
      checkNotificationPermission()
    }
    loadNotificationStates()
  }, [user])

  // Сохранение состояния для трекера настроения
  const handleToggleMoodTracker = async () => {
    const newState = !moodTrackerEnabled
    console.log('Mood Tracker Notifications Enabled:', newState)
    setMoodTrackerEnabled(newState)
    await saveNotificationState('moodTrackerNotificationsEnabled', newState)

    if (user?.access_token) {
      try {
        await updateNotificationPreferences(
          user.access_token,
          newState,
          challengeNotificationsEnabled,
        )
        if (newState) {
          await scheduleNotifications(
            notifications.filter((notification) => [2, 3].includes(notification.id)),
          )
        } else {
          await cancelNotifications([2, 3])
        }
      } catch (error) {
        console.error('Error updating notification preferences:', error)
      }
    }
  }

  const handleToggleChallengeNotifications = async () => {
    const newState = !challengeNotificationsEnabled
    console.log('Challenge Notifications Enabled:', newState)
    setChallengeNotificationsEnabled(newState)
    await saveNotificationState('challengeNotificationsEnabled', newState)

    if (user?.access_token) {
      try {
        await updateNotificationPreferences(user.access_token, moodTrackerEnabled, newState)
        if (newState) {
          await scheduleNotifications(
            notifications.filter((notification) => [1].includes(notification.id)),
          )
        } else {
          await cancelNotifications([1])
        }
      } catch (error) {
        console.error('Error updating notification preferences:', error)
      }
    }
  }

  return (
    <section className={`${styles.settings} container`}>
      <PageHeaderComponent title={'Налаштування'} />

      <div className={styles.settings__cards}>
        <ContactInfoComponent balance={false} color={`BLUE`} />

        <div className={`${styles.settings_card} ${styles.green}`}>
          <div className={styles.settings_card__header}>
            <h2>Конфіденційність</h2>

            <IconButtonComponent
              name={'Edit'}
              onClick={() => router.push('/settings/reset-password')}
            >
              <IconEdit />
            </IconButtonComponent>
          </div>

          <div className={styles.settings_card__content}>
            <div className={styles.settings_card__field}>
              <span>Пароль для входу</span>
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
              <span>Сповіщення про челенджі</span>
              <ToggleBtnComponent
                isChecked={challengeNotificationsEnabled}
                onToggle={handleToggleChallengeNotifications}
              />
            </div>
          </div>
        </div>
      </div>

      <ButtonComponent onClick={() => router.push('/account-deletion')}>
        Видалити аккаунт
      </ButtonComponent>
    </section>
  )
}

export default SettingsComponent
