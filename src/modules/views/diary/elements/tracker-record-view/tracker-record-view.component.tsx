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
import React, { FC, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useUpdateTrackerRecord, useGetSingleTracker } from '@/api/tracker'
import { MenuBarComponent } from '@/shared/components/templates/text-editor/elements/menu-bar'
import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import { IconArrow } from '@/shared/icons'
import { useUserStore } from '@/shared/stores'

import styles from './tracker-record-view.module.scss'
import { useTranslation } from 'react-i18next'

// interface
interface ITrackerRecord {}

// component
export const TrackerRecordViewComponent: FC<Readonly<ITrackerRecord>> = () => {
  const token = useUserStore((state) => state.user?.access_token)
  const { control, watch } = useForm()
  const searchParams = useSearchParams()
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
    editable: false, // Set the editor to be non-editable
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
    console.log('Полученные данные трекера:', singleTracker)
    if (singleTracker && editor) {
      const noteContent = singleTracker.note // Получаем объект note
      console.log('Содержимое note:', noteContent) // Логируем содержимое note

      // Получаем текст записи
      const cleanedTrackerNote = noteContent.note || '' // Извлекаем текст записи
      console.log('Очистка записи:', cleanedTrackerNote) // Логируем очищенную запись
      editor.commands.setContent(cleanedTrackerNote)
    }
  }, [singleTracker, editor])

  // return
  return (
    <section className={`${styles.tracker_record} container`}>
      <div className={styles.tracker_record__fixed_menu}>
        <div className={styles.tracker_record__top}>
          <div className={styles.tracker_record__header}>
            <IconButtonComponent name={'back'} onClick={handleBackClick}>
              <IconArrow />
            </IconButtonComponent>
          </div>

          {/* Отображение даты из данных сервера */}
          <div>
            {singleTracker
              ? moment(singleTracker.note.created_at).format('DD.MM.YYYY')
              : 'Завантаження'}
          </div>
        </div>
      </div>

      {status !== 'pending' && singleTracker ? (
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

          {/* Show the editor content as read-only */}
          <EditorContent editor={editor} />
        </div>
      ) : (
        <div></div>
      )}
    </section>
  )
}

export default TrackerRecordViewComponent
