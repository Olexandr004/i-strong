'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import { Placeholder } from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import moment from 'moment'
import React, { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useUpdateTrackerRecord, useGetSingleTracker } from '@/api/tracker'
import { ButtonComponent } from '@/shared/components'
import { MenuBarComponent } from '@/shared/components/templates/text-editor/elements/menu-bar'
import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import { IconArrow } from '@/shared/icons'
import { useUserStore } from '@/shared/stores'
import { namePattern, required } from '@/shared/validation'

import styles from './tracker-record.module.scss'
import { useTranslation } from 'react-i18next'

// interface
interface ITrackerRecord {}

// component
export const TrackerRecordComponent: FC<Readonly<ITrackerRecord>> = () => {
  const token = useUserStore((state) => state.user?.access_token)
  const { control, watch } = useForm()
  const searchParams = useSearchParams()
  const [isDelayed, setIsDelayed] = useState(false)
  const router = useRouter()
  const { t } = useTranslation()

  const handleBackClick = () => {
    router.back()
  }

  const {
    data: singleTracker,
    refetch: trackerRefetch,
    status,
  } = useGetSingleTracker(token ?? '', searchParams.get('record_id') ?? '')

  const editor = useEditor({
    content: '',
    extensions: [
      Placeholder.configure({
        placeholder: t('diaryPage.placeholder'),
      }),
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure(),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    editable: true,
  })

  // Переносим хук useUpdateTrackerRecord на верхний уровень
  const { mutate: updateTracker, status: updateStatus } = useUpdateTrackerRecord(
    token ?? '',
    searchParams.get('record_id') ?? '',
  )

  const isLoading = updateStatus === 'pending'

  useEffect(() => {
    console.log('Record ID изменился:', searchParams.get('record_id'))
    trackerRefetch()
  }, [searchParams.get('record_id')])

  useEffect(() => {
    if (singleTracker) {
      const timer = setTimeout(() => {
        setIsDelayed(true)
      }, 300)

      return () => clearTimeout(timer) // Очистка таймера при размонтировании
    }
  }, [singleTracker])

  useEffect(() => {
    if (singleTracker && editor) {
      const noteContent = singleTracker.note // Получаем объект note
      console.log('Содержимое note:', noteContent)

      // Преобразуем переносы строк (\n) в <br> для корректного отображения
      const cleanedTrackerNote = (noteContent.note || '').replace(/\n/g, '<br>')
      console.log('Очистка записи:', cleanedTrackerNote)

      editor.commands.setContent(cleanedTrackerNote)
    }
  }, [singleTracker, editor])

  const handleSave = () => {
    const title = watch('title')
    const formattedHtml = editor?.getHTML()

    updateTracker({
      note: formattedHtml,
      title: title ? title : moment(singleTracker?.note.created_at).format('dddd'),
    })
    router.back()
  }

  // Функция для открытия клавиатуры на iOS
  const handleEditorFocus = () => {
    if (editor) {
      editor.commands.focus() // Используем команду фокуса Tiptap для установки фокуса на редактор
    }

    // Дополнительная попытка с небольшим интервалом, чтобы гарантировать фокус
    setTimeout(() => {
      const editorElement = document.querySelector('.ProseMirror') as HTMLElement
      if (editorElement) {
        editorElement.focus()
      }
    }, 100)
  }

  // return
  return (
    <section className={`${styles.tracker_record} container`}>
      <div className={styles.tracker_record__fixed_menu}>
        <div className={styles.tracker_record__top}>
          <div className={styles.tracker_record__header}>
            <IconButtonComponent name={'back'} onClick={handleBackClick}>
              <IconArrow />
            </IconButtonComponent>

            <ButtonComponent size={'small'} onClick={handleSave}>
              {t('diaryPage.save')}
            </ButtonComponent>
          </div>

          {/* Отображение даты из данных сервера */}
          <div>
            {singleTracker
              ? moment(singleTracker.note.created_at).format('DD.MM.YYYY')
              : 'Завантаження'}
          </div>
        </div>

        <MenuBarComponent editor={editor} />
      </div>

      {isDelayed && status !== 'pending' && singleTracker ? (
        <div className={styles.tracker_record__editor_box}>
          <h4>{t('diaryPage.my_condition')}</h4>
          <Controller
            control={control}
            name={'emotions'}
            key={`emotions`}
            defaultValue={singleTracker.note.emotions ?? ''}
            render={() => (
              <p className={styles.tracker_record__title_input}>
                {Array.isArray(singleTracker.note.emotions) &&
                singleTracker.note.emotions.length > 0
                  ? singleTracker.note.emotions.join(', ') // Показываем эмоции через запятую
                  : ''}{' '}
                {/* Можно заменить на текст, если эмоций нет */}
              </p>
            )}
          />

          <div onClick={handleEditorFocus}>
            <EditorContent editor={editor} />
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </section>
  )
}

export default TrackerRecordComponent
