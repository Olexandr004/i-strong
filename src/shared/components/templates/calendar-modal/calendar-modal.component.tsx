import { FC } from 'react'

import { DateRangePicker } from '@/shared/components/templates/date-range-picker'
import { IconButtonComponent } from '@/shared/components/ui/icon-button'
import { IconClose } from '@/shared/icons'
import { useCommonStore } from '@/shared/stores'

import { BaseModalComponent } from '../base-modal'

import styles from './calendar-modal.module.scss'

//interface
interface ICalendarModal {
  value: { first?: string; second?: string }
  onChange: (value: any) => void
}

//component
export const CalendarModalComponent: FC<Readonly<ICalendarModal>> = ({ value, onChange }) => {
  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)

  const handleClose = () => {
    handleChangeCommonStore({ isModalActive: false })
  }

  //return
  return (
    <BaseModalComponent>
      <div className={styles.calendar_modal}>
        <IconButtonComponent onClick={handleClose} name={'close'}>
          <IconClose />
        </IconButtonComponent>

        <DateRangePicker value={value} onChange={onChange} />
      </div>
    </BaseModalComponent>
  )
}
export default CalendarModalComponent
