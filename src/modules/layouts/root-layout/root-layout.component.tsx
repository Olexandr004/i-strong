'use client'

import { usePathname } from 'next/navigation'
import { FC, ReactNode, useEffect, useState } from 'react'

import { useGetUserProfile } from '@/api/setting-user.api'
import { LoadingComponent } from '@/modules/layouts/loading'
import { FooterComponent, ToasterComponent } from '@/modules/layouts/root-layout/elements'
import { useUserStore } from '@/shared/stores'

import styles from './root-layout.module.scss'

//interface
interface IRootLayout {
  entry: ReactNode
  home: ReactNode
}

//component
export const RootLayoutComponent: FC<Readonly<IRootLayout>> = ({ entry, home }) => {
  const token = useUserStore((state) => state.user?.access_token)
  const [isProfileLoaded, setProfileLoaded] = useState(false) // состояние загрузки профиля
  const [isInitializing, setIsInitializing] = useState(true) // состояние инициализации

  const {
    data: UserProfile,
    refetch: userProfileRefetch,
    isFetching,
  } = useGetUserProfile(token ?? '')

  const pathName = usePathname()

  useEffect(() => {
    const initializeApp = async () => {
      if (token) {
        await userProfileRefetch()
      }
      setProfileLoaded(true) // Устанавливаем, что профиль загружен
      setIsInitializing(false) // Инициализация завершена
    }

    initializeApp() // Вызываем инициализацию приложения при изменении токена
  }, [token, userProfileRefetch])

  const isPageWithFooter = () => {
    return (
      pathName === '/' ||
      pathName === '/profile' ||
      pathName === '/tutorials' ||
      pathName === '/diary'
    )
  }

  // Проверяем, если приложение еще инициализируется или идет процесс загрузки профиля
  if (isInitializing || isFetching) {
    return <LoadingComponent />
  }

  // После завершения инициализации и загрузки профиля отображаем контент
  return (
    <body className={styles.layout}>
      {UserProfile && token ? (
        <>
          <main className={`${styles.layout__main} ${isPageWithFooter() && styles.with_footer}`}>
            {home}
          </main>

          {isPageWithFooter() && (
            <div className={styles.layout__footer}>
              <FooterComponent />
            </div>
          )}
        </>
      ) : (
        <main>{entry}</main>
      )}

      <div className={styles.layout__toaster}>
        <ToasterComponent />
      </div>
    </body>
  )
}

export default RootLayoutComponent
