'use client'
import { useRouter } from 'next/navigation'
import { FC, useState, useEffect } from 'react'
import { ButtonComponent, ContactInfoComponent, PageHeaderComponent } from '@/shared/components'
import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import ToggleBtnComponent from '@/shared/components/ui/toggle-btn/toggle-btn.component'
import { IconEdit } from '@/shared/icons'
import { useUserStore } from '@/shared/stores'
import styles from './settings.module.scss'

interface ISettings {}

export const SettingsComponent: FC<Readonly<ISettings>> = () => {
  const router = useRouter()
  const { user, handleChangeUserStore } = useUserStore()

  const [moodTrackerEnabled, setMoodTrackerEnabled] = useState<boolean>(false)
  const [challengeNotificationsEnabled, setChallengeNotificationsEnabled] = useState<boolean>(false)

  // Функция для загрузки состояния уведомлений
  const fetchNotificationPreferences = async (token: string) => {
    const response = await fetch('https://istrongapp.com/api/users/profile/', {
      method: 'GET', // Измените метод на GET
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const responseText = await response.text()
    console.log('Response Status:', response.status)
    console.log('Response Text:', responseText)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch notification preferences: ${response.status} - ${responseText}`,
      )
    }

    return JSON.parse(responseText)
  }

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
    }
    loadNotificationStates()
  }, [user])

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

  const handleResetRoit = () => {
    router.push('/settings/reset-password')
  }

  const handleDelete = () => {
    router.push('/account-deletion')
  }

  // Сохранение состояния для трекера настроения
  const handleToggleMoodTracker = async () => {
    const newState = !moodTrackerEnabled // Изменяем состояние
    setMoodTrackerEnabled(newState)

    if (user?.access_token) {
      try {
        const response = await updateNotificationPreferences(
          user.access_token,
          newState,
          challengeNotificationsEnabled,
        )
        // Обновляем состояние пользователя
        handleChangeUserStore(response.user) // Обновлено: сохраняем обновленные данные пользователя
      } catch (error) {
        console.error('Error updating notification preferences:', error)
      }
    }
  }

  // Сохранение состояния для уведомлений челленджей
  const handleToggleChallengeNotifications = async () => {
    const newState = !challengeNotificationsEnabled // Изменяем состояние
    setChallengeNotificationsEnabled(newState)

    if (user?.access_token) {
      try {
        const response = await updateNotificationPreferences(
          user.access_token,
          moodTrackerEnabled,
          newState,
        )
        // Обновляем состояние пользователя
        handleChangeUserStore(response.user) // Обновлено: сохраняем обновленные данные пользователя
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
              <span>Сповіщення про челенджі</span>
              <ToggleBtnComponent
                isChecked={challengeNotificationsEnabled}
                onToggle={handleToggleChallengeNotifications}
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
