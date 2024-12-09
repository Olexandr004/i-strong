'use client'

import { usePathname } from 'next/navigation'
import { FC, ReactNode, useEffect, useState } from 'react'
import { useGetUserProfile } from '@/api/setting-user.api'
import { LoadingComponent } from '@/modules/layouts/loading'
import { FooterComponent, ToasterComponent } from '@/modules/layouts/root-layout/elements'
import { useUserStore } from '@/shared/stores'
import styles from './root-layout.module.scss'

// interface
interface IRootLayout {
  entry: ReactNode
  home: ReactNode
}

// component
export const RootLayoutComponent: FC<Readonly<IRootLayout>> = ({ entry, home }) => {
  const token = useUserStore((state) => state.user?.access_token)

  const {
    data: UserProfile,
    refetch: userProfileRefetch,
    isFetching,
  } = useGetUserProfile(token ?? '')

  const pathName = usePathname()
  const [isUserChecked, setIsUserChecked] = useState(false)

  useEffect(() => {
    const checkUserProfile = async () => {
      if (token) {
        await userProfileRefetch()
      }
      // Добавляем задержку перед тем, как установить состояние проверки
      const timer = setTimeout(() => {
        setIsUserChecked(true)
      }, 100) // Задержка 100 мс, можно изменить по необходимости

      return () => clearTimeout(timer)
    }

    checkUserProfile()
  }, [token, userProfileRefetch])

  const isPageWithFooter = () => {
    return (
      pathName === '/' ||
      pathName === '/chest' ||
      pathName === '/tutorials' ||
      pathName === '/diary' ||
      pathName === '/curiosities'
    )
  }

  // return
  return (
    <body className={styles.layout}>
      {isFetching ? (
        <LoadingComponent />
      ) : (
        <>
          {isUserChecked ? (
            UserProfile && token ? (
              <>
                <main
                  className={`${styles.layout__main} ${isPageWithFooter() && styles.with_footer}`}
                >
                  {home}
                </main>
                {isPageWithFooter() && (
                  <div className={styles.layout__footer}>
                    <FooterComponent />
                  </div>
                )}
              </>
            ) : (
              <main className={`${styles.entry} ${isUserChecked ? styles.show : ''}`}>{entry}</main>
            )
          ) : (
            <LoadingComponent />
          )}
        </>
      )}
      <div className={styles.layout__toaster}>
        <ToasterComponent />
      </div>
    </body>
  )
}

export default RootLayoutComponent
