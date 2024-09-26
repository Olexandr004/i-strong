import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { FC } from 'react'

import { IconAccount, IconDiary, IconHome, IconSos, IconTutorial } from '@/shared/icons'

import styles from './footer.module.scss'

//interface
interface IFooter {}

const LINKS = [
  { icon: <IconHome />, link: '/' },
  { icon: <IconTutorial />, link: '/tutorials' },
  { icon: <IconDiary />, link: '/diary' },
  { icon: <IconAccount />, link: '/profile' },
]

//component
export const FooterComponent: FC<Readonly<IFooter>> = () => {
  const pathname = usePathname()

  // console.log(pathname)

  //return
  return (
    <nav className={styles.navigation}>
      <ul className={styles.navigation__list}>
        {LINKS.slice(0, 2).map((item) => (
          <li key={item.link}>
            <Link
              className={`${styles.navigation__link} ${item.link === '/tutorials' && styles.size} ${pathname === item.link && styles.active}`}
              href={item.link}
            >
              {item.icon}
            </Link>
          </li>
        ))}
      </ul>

      <Link href={'/help'} className={styles.navigation__help}>
        <IconSos />
      </Link>

      <ul className={styles.navigation__list}>
        {LINKS.slice(2, 4).map((item) => (
          <li key={item.link}>
            <Link
              className={`${styles.navigation__link} ${pathname === item.link && styles.active}`}
              href={item.link}
            >
              {item.icon}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
export default FooterComponent
