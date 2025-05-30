'use client'

import { FC, HTMLAttributes, ReactNode, useState } from 'react'
import InputMask from 'react-input-mask'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import styles from './input.module.scss'

//interface
interface IInput {
  type?: string
  label?: string
  hint?: string
  error?: boolean
  value: any
  onChange: (value: string) => void
  onBlur?: () => void
  sideAction?: () => void
  errorText?: string
  placeholder?: string
  icon?: ReactNode
  withMask?: boolean
  inputMode?: HTMLAttributes<any>['inputMode']
  inputId: string
  maxLength?: number
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

//component
export const InputComponent: FC<Readonly<IInput>> = ({
  label,
  hint,
  error,
  errorText,
  value,
  onChange,
  onBlur,
  sideAction,
  type = 'text',
  placeholder,
  icon,
  withMask,
  inputMode,
  inputId,
  maxLength,
  onKeyPress,
}) => {
  const [isFocus, setIsFocus] = useState(false)

  const handlePhoneChange = (phone: string, data: any, event: any, formattedValue: string) => {
    const digitsOnly = formattedValue.replace(/[^\d+]/g, '') // сохраняем "+" и цифры
    const trimmed = digitsOnly.slice(0, 16) // максимум 15 цифр + символ "+"
    onChange(trimmed)
  }

  return (
    <div className={`${styles.input}`}>
      {label && (
        <label className={`${styles.input__label} ${error ? styles.error : ''}`} htmlFor={inputId}>
          {label}
        </label>
      )}

      <div
        className={`${styles.input__field_wrapper} ${error ? styles.error : ''} ${value && !isFocus ? styles.filled : ''} ${isFocus ? styles.focus : ''}`}
      >
        {type === 'tel' ? (
          <PhoneInput
            country={'ua'}
            value={value}
            onChange={handlePhoneChange}
            inputProps={{
              id: inputId,
              name: inputId,
              autoComplete: 'off',
              onFocus: () => setIsFocus(true),
              onBlur: () => {
                onBlur?.()
                setIsFocus(false)
              },
              placeholder: placeholder || '',
            }}
            disableDropdown={false}
            countryCodeEditable={false}
            excludeCountries={['ru', 'by']}
            enableSearch={true}
            inputStyle={{
              width: '100%',
              borderColor: error ? 'red' : undefined,
              height: '40px',
              paddingLeft: '48px',
              borderRadius: '8px',
              fontSize: '14px',
            }}
            containerStyle={{ width: '100%' }}
          />
        ) : withMask ? (
          <InputMask
            mask='+38 (999) 999 99 99'
            maskChar={null}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${styles.input__field} ${error ? styles.error : ''}`}
            onFocus={() => setIsFocus(true)}
            onBlur={() => {
              onBlur?.()
              setIsFocus(false)
            }}
            type={type}
            id={inputId}
            autoComplete='off'
            inputMode={inputMode}
            placeholder={placeholder}
          />
        ) : (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${styles.input__field} ${error ? styles.error : ''}`}
            onFocus={() => setIsFocus(true)}
            onBlur={() => {
              onBlur?.()
              setIsFocus(false)
            }}
            type={type}
            autoComplete='off'
            inputMode={inputMode}
            id={inputId}
            placeholder={placeholder}
            maxLength={maxLength}
            onKeyPress={onKeyPress}
          />
        )}

        {icon && sideAction && (
          <div
            className={styles.input__icon}
            onClick={(e) => {
              e.preventDefault()
              sideAction()
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {hint && !error && <p className={`${styles.input__hint}`}>{hint}</p>}
      {errorText && (
        <p className={`${styles.input__hint} ${error ? styles.error : ''}`}>{errorText}</p>
      )}
    </div>
  )
}

export default InputComponent
