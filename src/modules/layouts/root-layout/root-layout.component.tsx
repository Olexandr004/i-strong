import { usePathname, useRouter } from 'next/navigation'
import { FC, ReactNode, useEffect, useState } from 'react'
import { useGetUserProfile } from '@/api/setting-user.api'
import { LoadingComponent } from '@/modules/layouts/loading'
import { FooterComponent, ToasterComponent } from '@/modules/layouts/root-layout/elements'
import { useUserStore } from '@/shared/stores'
import styles from './root-layout.module.scss'

interface IRootLayout {
  entry: ReactNode
  home: ReactNode
}

export const RootLayoutComponent: FC<Readonly<IRootLayout>> = ({ entry, home }) => {
  const token = useUserStore((state) => state.user?.access_token)
  const router = useRouter()
  const {
    data: UserProfile,
    refetch: userProfileRefetch,
    isFetching,
  } = useGetUserProfile(token ?? '')
  const pathName = usePathname()

  // Состояние для контроля видимости экрана авторизации
  const [showEntry, setShowEntry] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        await userProfileRefetch()
      }
    }

    fetchData()
  }, [token, userProfileRefetch])

  useEffect(() => {
    if (!isFetching) {
      if (UserProfile) {
        setShowEntry(false) // Пользователь аутентифицирован, не показываем entry
      } else {
        setShowEntry(true) // Пользователь не аутентифицирован, показываем entry
        router.push('/') // Замените '/' на путь к вашему экрану авторизации
      }
    }
  }, [isFetching, UserProfile, router])

  const isPageWithFooter = () => {
    return (
      pathName === '/' ||
      pathName === '/profile' ||
      pathName === '/tutorials' ||
      pathName === '/diary'
    )
  }

  return (
    <body className={styles.layout}>
      {isFetching ? (
        <LoadingComponent />
      ) : (
        <>
          {UserProfile && token ? (
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
            // Показываем entry только если showEntry = true
            <main className={`${styles.entry} ${showEntry ? styles.show : ''}`}>{entry}</main>
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
