'use client'
import { useRouter } from 'next/navigation'

import { FC } from 'react'

import { ButtonComponent, ContactInfoComponent, PageHeaderComponent } from '@/shared/components'
import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import ToggleBtnComponent from '@/shared/components/ui/toggle-btn/toggle-btn.component'
import { IconEdit } from '@/shared/icons'

import styles from './settings.module.scss'

//interface
interface ISettings {}

//component
export const SettingsComponent: FC<Readonly<ISettings>> = () => {
  const router = useRouter()

  const handleResetRoit = () => {
    router.push('/settings/reset-password')
  }
  const handleDelete = () => {
    router.push('/account-deletion')
  }

  //return
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

              <ToggleBtnComponent />
            </div>

            <div className={styles.settings_card__field}>
              <span>Інші сповіщення</span>

              <ToggleBtnComponent />
            </div>
          </div>
        </div>
      </div>

      <ButtonComponent onClick={handleDelete}>Видалити аккаунт</ButtonComponent>
    </section>
  )
}
export default SettingsComponent
