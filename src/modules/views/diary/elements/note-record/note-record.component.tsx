'use client'
import React, { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import { Placeholder } from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import moment from 'moment'

import { updateNoteRecord, useGetSingleNote } from '@/api/notes'
import { ButtonComponent } from '@/shared/components'
import { MenuBarComponent } from '@/shared/components/templates/text-editor/elements/menu-bar'
import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import { IconArrow } from '@/shared/icons'
import { useUserStore } from '@/shared/stores'
import { namePattern, required } from '@/shared/validation'

import styles from './note-record.module.scss'

//interface
interface INoteRecord {}

//component
export const NoteRecordComponent: FC<Readonly<INoteRecord>> = () => {
  const token = useUserStore((state) => state.user?.access_token)
  const { control, watch, setValue } = useForm() // <-- Извлекаем setValue здесь
  const searchParams = useSearchParams()
  const [isDelayed, setIsDelayed] = useState(false)

  const router = useRouter()

  const handleBackClick = () => {
    router.back()
  }

  const {
    data: singleNote,
    refetch: noteRefetch,
    status,
  } = useGetSingleNote(token ?? '', searchParams.get('record_id') ?? '')

  const editor = useEditor({
    content: '',
    extensions: [
      Placeholder.configure({
        placeholder: 'Тут ще немає тексту',
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
    noteRefetch()
  }, [searchParams.get('record_id')])

  const cleanText = (text: string) => {
    if (text.length <= 2) {
      return ''
    }
    const cleanedText = text
    return cleanedText.replace(/\n/g, '<br />')
  }

  useEffect(() => {
    const cleanedNote = cleanText(singleNote?.note ?? '')
    editor?.commands.setContent(cleanedNote)
  }, [singleNote, editor])

  useEffect(() => {
    if (singleNote) {
      const timer = setTimeout(() => {
        setIsDelayed(true)
      }, 300)

      return () => clearTimeout(timer) // Очистка таймера при размонтировании
    }
  }, [singleNote])
  // Используем setValue для установки заголовка в форму
  useEffect(() => {
    if (singleNote) {
      setValue('title', singleNote.title || moment(singleNote.created_at).format('dddd'))
    }
  }, [singleNote, setValue]) // setValue теперь доступна

  const { mutate: updateNote } = useMutation({
    mutationFn: (form: any) =>
      updateNoteRecord(form, token ?? '', searchParams.get('record_id') ?? ''),
    onSuccess: (data: any) => {
      router.back()
    },
  })

  const handleSave = () => {
    const title = watch('title')
    const formattedHtml = JSON.stringify(editor?.getHTML())
    updateNote({
      note: formattedHtml,
      title: title || moment(singleNote?.created_at).format('dddd'),
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

          <div>{moment(singleNote?.created_at).format('DD.MM.YYYY')}</div>
        </div>

        <MenuBarComponent editor={editor} />
      </div>

      {isDelayed && (status !== 'pending' || singleNote) ? (
        <div className={styles.diary_record__editor_box}>
          <Controller
            control={control}
            name={'title'}
            key={`title`}
            defaultValue={singleNote?.title ?? ''}
            render={({ field: { value, onChange } }) => (
              <input
                value={value}
                onChange={onChange}
                className={styles.diary_record__title_input}
                placeholder={'Заголовок'}
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
        <div></div>
      )}
    </section>
  )
}

export default NoteRecordComponent
