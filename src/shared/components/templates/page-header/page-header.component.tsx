'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { App as CapacitorApp } from '@capacitor/app'

import { FC, useEffect } from 'react'

import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import { IconArrow } from '@/shared/icons'

import styles from './page-header.module.scss'

//interface
interface IPageHeader {
  title: string
  gapSize?: 'small' | 'large'
}

//component
export const PageHeaderComponent: FC<Readonly<IPageHeader>> = ({ title, gapSize = 'small' }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => {
    const handleBackButton = async () => {
      if (pathname === '/') {
        await CapacitorApp.exitApp()
      } else {
        handleBackClick()
      }
    }
    document.addEventListener('backbutton', handleBackButton, false)

    return () => {
      document.removeEventListener('backbutton', handleBackButton, false)
    }
  }, [router])
  const handleBackClick = () => {
    if (['/settings/reset-password'].includes(pathname) && searchParams.size >= 1) {
      router.push('/settings')
    } else if (['/statistic', '/challenges'].includes(pathname) && searchParams.size >= 1) {
      router.push('/profile')
    } else if (
      ['/store', '/favorite', '/challenges', '/settings', '/settings/reset-password'].includes(
        pathname,
      ) &&
      searchParams.size === 0
    ) {
      router.push('/profile')
    } else {
      router.back()
    }
  }

  //return
  return (
    <div className={`${styles.page_header} ${gapSize === 'large' && styles.large_gap}`}>
      <IconButtonComponent name={'back'} onClick={handleBackClick}>
        <IconArrow />
      </IconButtonComponent>

      <h1 className={`${styles.page_header__title} title`}>{title}</h1>
    </div>
  )
}
export default PageHeaderComponent
