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

  const {
    data: UserProfile,
    refetch: userProfileRefetch,
    isFetching,
  } = useGetUserProfile(token ?? '')

  const pathName = usePathname()

  useEffect(() => {
    const loadUserProfile = async () => {
      if (token) {
        await userProfileRefetch()
      }
      setProfileLoaded(true) // Устанавливаем, что профиль загружен
    }

    loadUserProfile() // вызываем загрузку при каждом изменении токена
  }, [token, userProfileRefetch])

  const isPageWithFooter = () => {
    return (
      pathName === '/' ||
      pathName === '/profile' ||
      pathName === '/tutorials' ||
      pathName === '/diary'
    )
  }

  // Отображаем экран загрузки, если профиль еще не загружен
  if (!isProfileLoaded || isFetching) {
    return <LoadingComponent />
  }

  // После завершения загрузки, проверяем профиль и отображаем соответствующий контент
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
