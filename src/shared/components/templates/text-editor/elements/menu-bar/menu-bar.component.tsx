import React, { FC } from 'react'

import { IconBoldText, IconList, IconTrashBin, IconUndoArrow } from '@/shared/icons'

import styles from './menu-bar.module.scss'

//interface
interface IMenuBar {
  editor: any
}

const colorsForText = [
  { color: '#BD3333' },
  { color: '#647DAD' },
  { color: '#B0C597' },
  { color: '#FFC75A' },
]

//component
export const MenuBarComponent: FC<Readonly<IMenuBar>> = ({ editor }) => {
  if (!editor) {
    return null
  }

  // return
  return (
    <div className={styles.menu_bar}>
      <div className={styles.menu_bar__top}>
        <button
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().chain().focus().undo().run()}
        >
          <IconUndoArrow />
        </button>

        <button
          className={styles.menu_bar__redo_btn}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <IconUndoArrow />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`${editor.isActive('bold') ? 'is-active' : ''} ${styles.menu_bar__bold_text}`}
        >
          <IconBoldText />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${editor.isActive('bulletList') ? 'is-active' : ''}  ${styles.menu_bar__list}`}
        >
          <IconList />
        </button>
      </div>
    </div>
  )
}
export default MenuBarComponent
