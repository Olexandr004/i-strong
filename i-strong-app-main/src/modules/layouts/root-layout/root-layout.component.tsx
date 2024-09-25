'use client'

import { usePathname } from 'next/navigation'

import { FC, ReactNode, useEffect } from 'react'

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

  const {
    data: UserProfile,
    refetch: userProfileRefetch,
    isFetching,
  } = useGetUserProfile(token ?? '')

  console.log(UserProfile)

  const pathName = usePathname()

  useEffect(() => {
    if (token) {
      userProfileRefetch()
    }
  }, [token])

  const isPageWithFooter = () => {
    return (
      pathName === '/' ||
      pathName === '/profile' ||
      pathName === '/tutorials' ||
      pathName === '/diary'
    )
  }

  //return
  return (
    <body className={styles.layout}>
      {!isFetching ? (
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
            <main>{entry}</main>
          )}
        </>
      ) : (
        <LoadingComponent />
      )}

      <div className={styles.layout__toaster}>
        <ToasterComponent />
      </div>
    </body>
  )
}
export default RootLayoutComponent
