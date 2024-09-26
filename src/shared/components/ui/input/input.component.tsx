'use client'

import { FC, HTMLAttributes, ReactNode, useState } from 'react'
import InputMask from 'react-input-mask'

import styles from './input.module.scss'

//interface
interface IInput {
  type?: string
  label?: string
  hint?: string
  error?: boolean
  value: any
  onChange: () => void
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
  //return
  return (
    <div className={`${styles.input}`}>
      {label && (
        <label className={`${styles.input__label} ${error && styles.error}`} htmlFor='input'>
          {label}
        </label>
      )}

      <div
        className={`${styles.input__field_wrapper} ${error && styles.error} ${value && !isFocus && styles.filled}  ${isFocus && styles.focus}`}
      >
        {withMask ? (
          <InputMask
            mask='+38 (999) 999 99 99'
            maskChar={null}
            value={value}
            onChange={onChange}
            className={`${styles.input__field} ${error && styles.error}`}
            onFocus={() => setIsFocus(true)}
            onBlur={() => {
              if (onBlur) {
                onBlur()
              }
              setIsFocus(false)
            }}
            type={type}
            id={inputId}
            autoComplete={'off'}
            inputMode={inputMode}
            placeholder={placeholder}
          />
        ) : (
          <input
            value={value}
            onChange={onChange}
            className={`${styles.input__field} ${error && styles.error}`}
            onFocus={() => setIsFocus(true)}
            onBlur={() => {
              if (onBlur) {
                onBlur()
              }
              setIsFocus(false)
            }}
            type={type}
            autoComplete={'off'}
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

      {hint && !error && <p className={`${styles.input__hint} ${error && styles.error}`}>{hint}</p>}
      {errorText && <p className={`${styles.input__hint} ${error && styles.error}`}>{errorText}</p>}
    </div>
  )
}
export default InputComponent
