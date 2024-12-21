'use client'

import { useRouter } from 'next/navigation'
import { FC, useState, useEffect } from 'react'
import { App } from '@capacitor/app'
import { ButtonComponent, ContactInfoComponent, PageHeaderComponent } from '@/shared/components'
import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import ToggleBtnComponent from '@/shared/components/ui/toggle-btn/toggle-btn.component'
import { IconEdit } from '@/shared/icons'
import { PushNotifications } from '@capacitor/push-notifications'
import styles from './settings.module.scss'
import { useCommonStore } from '@/shared/stores'

interface ISettings {}

export const SettingsComponent: FC<Readonly<ISettings>> = () => {
  const router = useRouter()

  const [moodTrackerEnabled, setMoodTrackerEnabled] = useState<boolean>(false)
  const [challengeNotificationsEnabled, setChallengeNotificationsEnabled] = useState<boolean>(false)
  const [errorText, setErrorText] = useState('')
  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)
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

  const requestNotificationPermission = async () => {
    const permissionStatus = await PushNotifications.requestPermissions()

    if (permissionStatus.receive === 'granted') {
      setMoodTrackerEnabled(true)
      setChallengeNotificationsEnabled(true)
    } else {
      setErrorText('Будь ласка, дайте дозвіл на отримання сповіщень у налаштуваннях телефону.')
      handleChangeCommonStore({
        errorText: 'Будь ласка, дайте дозвіл на отримання сповіщень у налаштуваннях телефону.',
      })
    }
  }

  const handleToggleMoodTracker = async () => {
    const permissionStatus = await PushNotifications.checkPermissions()

    if (permissionStatus.receive === 'granted') {
      setMoodTrackerEnabled((prev) => !prev)
    } else {
      setErrorText('Будь ласка, дайте дозвіл на отримання сповіщень у налаштуваннях телефону.')
      handleChangeCommonStore({
        errorText: 'Будь ласка, дайте дозвіл на отримання сповіщень у налаштуваннях телефону.',
      })
    }
  }

  const handleToggleChallengeNotifications = async () => {
    const permissionStatus = await PushNotifications.checkPermissions()

    if (permissionStatus.receive === 'granted') {
      setChallengeNotificationsEnabled((prev) => !prev)
    } else {
      setErrorText('Будь ласка, дайте дозвіл на отримання сповіщень у налаштуваннях телефону.')
      handleChangeCommonStore({
        errorText: 'Будь ласка, дайте дозвіл на отримання сповіщень у налаштуваннях телефону.',
      })
    }
  }

  useEffect(() => {
    checkNotificationPermission()
  }, [])

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
            <h2>Сповіщення</h2>
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
