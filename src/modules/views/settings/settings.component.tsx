'use client'

import { useRouter } from 'next/navigation'
import { FC, useState, useEffect } from 'react'
import { PushNotifications } from '@capacitor/push-notifications'
import { ButtonComponent, ContactInfoComponent, PageHeaderComponent } from '@/shared/components'
import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import ToggleBtnComponent from '@/shared/components/ui/toggle-btn/toggle-btn.component'
import { IconEdit } from '@/shared/icons'
import styles from './settings.module.scss'
import { useCommonStore } from '@/shared/stores'

interface ISettings {}

export const SettingsComponent: FC<Readonly<ISettings>> = () => {
  const router = useRouter()

  const [moodTrackerEnabled, setMoodTrackerEnabled] = useState<boolean>(false)
  const [challengeNotificationsEnabled, setChallengeNotificationsEnabled] = useState<boolean>(false)
  const [errorText, setErrorText] = useState('')
  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)

  // Проверка прав на получение уведомлений
  const checkNotificationPermission = async () => {
    const permissionStatus = await PushNotifications.checkPermissions()
    if (permissionStatus.receive === 'granted') {
      setMoodTrackerEnabled((prev) => prev ?? true) // Если нет сохраненного значения, установить в true
      setChallengeNotificationsEnabled((prev) => prev ?? true) // Если нет сохраненного значения, установить в true
    } else {
      setMoodTrackerEnabled(false)
      setChallengeNotificationsEnabled(false)
    }
  }

  // Запрос разрешений на уведомления
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

  // Обработка переключателя трекера настроений
  const handleToggleMoodTracker = async () => {
    const permissionStatus = await PushNotifications.checkPermissions()

    if (permissionStatus.receive !== 'granted') {
      setErrorText('Будь ласка, дайте дозвіл на отримання сповіщень у налаштуваннях телефону.')
      handleChangeCommonStore({
        errorText: 'Будь ласка, дайте дозвіл на отримання сповіщень у налаштуваннях телефону.',
      })
      return
    }

    setErrorText('') // Очистить ошибку, если разрешение на уведомления предоставлено
    const newValue = !moodTrackerEnabled
    setMoodTrackerEnabled(newValue)
    localStorage.setItem('moodTrackerEnabled', JSON.stringify(newValue)) // Сохранение в localStorage
  }

  // Обработка переключателя уведомлений о челленджах
  const handleToggleChallengeNotifications = async () => {
    const permissionStatus = await PushNotifications.checkPermissions()

    if (permissionStatus.receive !== 'granted') {
      setErrorText('Будь ласка, дайте дозвіл на отримання сповіщень у налаштуваннях телефону.')
      handleChangeCommonStore({
        errorText: 'Будь ласка, надайте дозвіл на отримання сповіщень у налаштуваннях телефону',
      })
      return
    }

    setErrorText('') // Очистить ошибку, если разрешение на уведомления предоставлено
    const newValue = !challengeNotificationsEnabled
    setChallengeNotificationsEnabled(newValue)
    localStorage.setItem('challengeNotificationsEnabled', JSON.stringify(newValue)) // Сохранение в localStorage
  }

  // Загрузка состояния из localStorage при монтировании компонента
  useEffect(() => {
    const savedMoodTrackerEnabled = localStorage.getItem('moodTrackerEnabled')
    const savedChallengeNotificationsEnabled = localStorage.getItem('challengeNotificationsEnabled')

    if (savedMoodTrackerEnabled !== null) {
      setMoodTrackerEnabled(JSON.parse(savedMoodTrackerEnabled))
    }
    if (savedChallengeNotificationsEnabled !== null) {
      setChallengeNotificationsEnabled(JSON.parse(savedChallengeNotificationsEnabled))
    }

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
