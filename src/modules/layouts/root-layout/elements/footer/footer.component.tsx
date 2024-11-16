import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { FC } from 'react'

import { IconDiary, IconHome, IconCuriosities, IconTutorial, IconChest } from '@/shared/icons'

import styles from './footer.module.scss'

//interface
interface IFooter {}

const LINKS = [
  { icon: <IconHome />, link: '/' },
  { icon: <IconTutorial />, link: '/tutorials' },
  { icon: <IconCuriosities />, link: '/curiosities' },
  { icon: <IconDiary />, link: '/diary' },
  { icon: <IconChest />, link: '/chest' },
]

//component
export const FooterComponent: FC<Readonly<IFooter>> = () => {
  const pathname = usePathname()

  // console.log(pathname)

  //return
  return (
    <nav className={styles.navigation}>
      <ul className={styles.navigation__list}>
        {LINKS.map((item, index) => (
          <li key={item.link}>
            <Link
              className={`${styles.navigation__link} ${index === 1 && styles.size} ${pathname === item.link && styles.active}`}
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
