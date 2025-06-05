import { FC } from 'react'
import styles from './modal.module.scss'
import { ButtonComponent } from '@/shared/components/ui'
import { useTranslation } from 'react-i18next'

interface IModalProps {
  isOpen: boolean
  title: string
  onConfirm: () => void
  onCancel: () => void
}

export const ModalComponent: FC<IModalProps> = ({ isOpen, title, onConfirm, onCancel }) => {
  const { t } = useTranslation()
  if (!isOpen) return null

  return (
    <div className={styles.modal}>
      <div className={styles.modal_content}>
        <h2>{title}</h2>
        <img src='/image/delete-capi-diary.png' alt='delete' />
        <div className={styles.modal_buttons}>
          <ButtonComponent size={'regular'} variant={'outlined'} onClick={onConfirm}>
            {t('storePage.yes')}
          </ButtonComponent>
          <ButtonComponent size={'regular'} onClick={onCancel}>
            {t('storePage.no')}
          </ButtonComponent>
        </div>
      </div>
    </div>
  )
}

export default ModalComponent
