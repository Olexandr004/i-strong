import { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useSettingUpdateUserInfoRequest } from '@/shared/hooks/useSettingsMutations'
import { IconCoin, IconEdit } from '@/shared/icons'
import { useUserStore } from '@/shared/stores'
import { namePattern, phoneNumberPatternOrder, required } from '@/shared/validation'

import { ButtonComponent, InputComponent } from '../../ui'
import { IconButtonComponent } from '../../ui/icon-button'

import styles from './contact-info-form.module.scss'
//interface
interface IContactInfo {
  balance: boolean
  color: 'BLUE' | 'GRAU'
  setUserData?: (data: any) => void
  userData?: any
}

//component
export const ContactInfoComponent: FC<IContactInfo> = ({
  balance,
  color,
  userData,
  setUserData,
}) => {
  const { updateUserMutation, userForm, setUserForm } = useSettingUpdateUserInfoRequest()
  const { user } = useUserStore()
  const { handleSubmit, control } = useForm({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      username: userData ? userData.username : user?.name || '',
      phone_number: userData ? userData.phone_number : user?.phone_number || '',
    },
  })
  const handleClick = () => {
    setUserForm(true)
  }

  const handleSendForm = (data: any) => {
    const updatedData = {
      username: data.username || user?.name,
      phone_number: data.phone_number?.replace(/[^0-9]/g, '') || user?.phone_number,
    }
    if (setUserData) {
      setUserData(updatedData)
      setUserForm(false)
    } else {
      updateUserMutation(updatedData)
    }
  }

  const cardClass = color === 'BLUE' ? styles.blue : styles.grau

  return (
    <div className={`${styles.settings_card} ${cardClass}`}>
      {!userForm ? (
        <>
          <div className={styles.settings_card__header}>
            <h2 className={`text-3`}>{balance ? 'Контактні данні ' : 'Контакта інформація'}</h2>

            <IconButtonComponent name={'Edit'} onClick={handleClick}>
              <IconEdit />
            </IconButtonComponent>
          </div>
          <div className={styles.settings_card__content}>
            <div className={styles.settings_card__field}>
              <span>Ім’я</span>

              <span className={styles.settings_card__field_value}>
                {userData ? userData.username : user?.name}
              </span>
            </div>

            <div className={styles.settings_card__field}>
              <span>Телефон</span>

              <span className={styles.settings_card__field_value}>
                +{userData ? userData.phone_number : user?.phone_number}
              </span>
            </div>
            {balance && (
              <div className={styles.settings_card__user_info}>
                <p className={`text-5-grey `}>Баланс:</p>
                <div className={`text-5-grey ${styles.settings_card__user_info_balance}`}>
                  <div className={styles.settings_card__user_info_svg}>
                    <IconCoin />
                  </div>
                  {user?.coins}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className={styles.settings_card__header}>
            <h2>Контактні данні</h2>
          </div>
          <form autoComplete={'off'} onSubmit={handleSubmit(handleSendForm)}>
            <div className={styles.settings_card_iput_wrap}>
              <Controller
                control={control}
                name={'username'}
                key={`username`}
                // defaultValue={userData ? userData.username : user?.name || ''}
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                  <InputComponent
                    value={value}
                    inputId={`username`}
                    onChange={onChange}
                    onBlur={onBlur}
                    inputMode={'text'}
                    label={'Ім’я:'}
                    error={!!error}
                    placeholder={'Ім’я'}
                    errorText={error?.message}
                  />
                )}
                rules={{
                  required: required,
                  pattern: namePattern,
                }}
              />

              <Controller
                control={control}
                name='phone_number'
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
                  return (
                    <InputComponent
                      type='tel'
                      label='Телефон'
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={!!error}
                      errorText={error?.message}
                      placeholder='Ваш телефон'
                      withMask
                      inputMode='tel'
                      inputId='phone_number'
                    />
                  )
                }}
                rules={{
                  required: required,
                  pattern: phoneNumberPatternOrder,
                }}
              />

              {balance && (
                <div className={styles.settings_card__user_info}>
                  <p className={`text-5-grey `}>Баланс:</p>
                  <div className={`text-5-grey ${styles.settings_card__user_info_balance}`}>
                    <div className={styles.settings_card__user_info_svg}>
                      <IconCoin />
                    </div>
                    {user?.coins}
                  </div>
                </div>
              )}
            </div>
            <div className={styles.settings_card__bottom}>
              <ButtonComponent type='submit' size={'small'}>
                Зберегти
              </ButtonComponent>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
export default ContactInfoComponent
