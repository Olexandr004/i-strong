'use client'
import React, { FC, useRef, useState } from 'react'

import styles from './input-code.module.scss'

interface IPinInput {
  length: number
  value?: string
  label?: string
  loading?: boolean
  onChange: (value: string) => void
}

export const InputCodeComponent: FC<Readonly<IPinInput>> = ({
  length,
  onChange,

  label,
  loading,
}) => {
  const [code, setCode] = useState(Array(length).fill(''))
  const [isFocus, setIsFocus] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const processInput = (e: React.ChangeEvent<HTMLInputElement>, slot: number) => {
    const newNum = e.target.value
    if (/[^0-9]/.test(newNum) || !newNum) return

    const newCode = [...code]
    let nextSlot = slot
    while (newCode[nextSlot] && nextSlot < length - 1) {
      nextSlot++
    }

    newCode[nextSlot] = newNum
    setCode(newCode)

    if (nextSlot < length - 1) {
      inputs.current[nextSlot + 1]?.focus()
    } else {
      onChange(newCode.join(''))
    }
  }

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, slot: number) => {
    if (e.key === 'Backspace') {
      const newCode = [...code]
      if (!newCode[slot] && slot > 0) {
        newCode[slot - 1] = ''
        setCode(newCode)
        inputs.current[slot - 1]?.focus()
        onChange(newCode.join(''))
      } else {
        newCode[slot] = ''
        updateCode(newCode)
        setCode(newCode)
      }
    }
  }

  const updateCode = (newCode: string[]) => {
    setCode(newCode)
    const filledCode = newCode.filter((num) => num !== '')
    if (filledCode.length === length) {
      onChange(newCode.join(''))
    } else {
      onChange('')
    }
  }
  return (
    <div className={styles.input}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={`${styles.code_input__container} ${isFocus ? styles.focus : ''}`}>
        {code.map((num, idx) => (
          <input
            className={styles.code_input}
            key={`code-input-${idx}`}
            type='text'
            inputMode='numeric'
            maxLength={1}
            value={num}
            autoFocus={!code[0].length && idx === 0}
            readOnly={loading}
            onChange={(e) => processInput(e, idx)}
            onKeyUp={(e) => onKeyUp(e, idx)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            ref={(el) => {
              inputs.current[idx] = el
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default InputCodeComponent
