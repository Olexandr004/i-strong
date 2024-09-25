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

import { postDiaryRecord, updateDiaryRecord, useGetSingleRecord } from '@/api/diary.api'
import { ButtonComponent } from '@/shared/components'
import { MenuBarComponent } from '@/shared/components/templates/text-editor/elements/menu-bar'
import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import { IconArrow } from '@/shared/icons'
import { useUserStore } from '@/shared/stores'
import { namePattern, required } from '@/shared/validation'

import styles from './diary-record.module.scss'

//interface
interface IDiaryRecord {}

//component
export const DiaryRecordComponent: FC<Readonly<IDiaryRecord>> = () => {
  const token = useUserStore((state) => state.user?.access_token)
  const { control, watch } = useForm()
  const searchParams = useSearchParams()

  const router = useRouter()

  const handleBackClick = () => {
    router.back()
  }

  const {
    data: singleDiaryRecord,
    refetch: diaryRecordRefetch,
    status,
  } = useGetSingleRecord(token ?? '', searchParams.get('record_id') ?? '')

  const cleanText = (text: string) => {
    if (text.length <= 2) {
      return ''
    }
    const cleanedText = text.substring(1, text.length - 1)
    return cleanedText
  }

  const editor = useEditor({
    content: '',
    extensions: [
      Placeholder.configure({
        placeholder: 'Як ти?',
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

  useEffect(() => {
    diaryRecordRefetch()
  }, [searchParams.get('record_id')])

  useEffect(() => {
    const cleanedNote = cleanText(singleDiaryRecord?.note ?? '')
    editor?.commands.setContent(cleanedNote)
  }, [singleDiaryRecord, editor])

  const { mutate: postDiaryNote } = useMutation({
    mutationFn: (form: any) => postDiaryRecord(form, token ?? ''),
    onSuccess: () => {
      router.back()
    },
  })
  const { mutate: updateDiaryNote } = useMutation({
    mutationFn: (form: any) =>
      updateDiaryRecord(form, token ?? '', searchParams.get('record_id') ?? ''),
    onSuccess: () => {
      router.back()
    },
  })

  const handleSave = () => {
    const title = watch('title')

    const formattedHtml = JSON.stringify(editor?.getHTML())
    searchParams.get('record_id')
      ? updateDiaryNote({
          note: formattedHtml,
          title: title ? title : moment(singleDiaryRecord?.created_at).format('dddd'),
        })
      : postDiaryNote({
          note: formattedHtml,
          title: title ? title : moment(singleDiaryRecord?.created_at).format('dddd'),
        })
  }

  //return
  return (
    <section className={`${styles.diary_record} container`}>
      <div className={styles.diary_record__fixed_menu}>
        <div className={styles.diary_record__top}>
          <div className={styles.diary_record__header}>
            <IconButtonComponent name={'back'} onClick={handleBackClick}>
              <IconArrow />
            </IconButtonComponent>

            <ButtonComponent size={'small'} onClick={handleSave}>
              Зберегти
            </ButtonComponent>
          </div>

          <div>{moment(singleDiaryRecord?.created_at).format('DD.MM.YYYY')}</div>
        </div>

        <MenuBarComponent editor={editor} />
      </div>

      {status !== 'pending' || singleDiaryRecord ? (
        <div className={styles.diary_record__editor_box}>
          <Controller
            control={control}
            name={'title'}
            key={`title`}
            defaultValue={singleDiaryRecord?.title ?? ''}
            render={({ field: { value, onChange } }) => (
              <textarea
                value={value}
                onChange={onChange}
                className={styles.diary_record__title_input}
                placeholder={'Що сталося сьогодні? '}
              />
            )}
            rules={{
              required: required,
              pattern: namePattern,
            }}
          />

          <EditorContent editor={editor} />
        </div>
      ) : (
        <div>Завантаження</div>
      )}
    </section>
  )
}
export default DiaryRecordComponent
