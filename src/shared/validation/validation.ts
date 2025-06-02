import i18n from 'i18next'

const t = i18n.t
export const required = t('validation.required')

export const lengthPattern: { value: any; message: string } = {
  value: /^.{2,255}$/,
  message: t('validation.length'),
}

export const phoneNumberPattern = {
  value: /^\+[1-9]\d{9,14}$/,
  message: t('validation.phone'),
}

export const passwordPattern: { value: any; message: string } = {
  // value: /^(?=\s*\S*[0-9]\S*\s*$)(?=\s*\S*[a-zA-Z]\S*\s*$)[a-zA-Z0-9@#$_&+()/]{8,15}$/,
  value: /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&()#_+]{8,15}$/,
  message: t('validation.password'),
}

export const namePattern: { value: any; message: string } = {
  value: /^(?=(?:.*[^\s]){2})[\wа-яА-ЯЇїІіЄєҐґ\d\s.`\-_'’]{2,30}$/,
  message: t('validation.name'),
}

export const pinPattern: { value: any; message: string } = {
  value: /^\d{4}$/,
  message: t('validation.pin'),
}

export const phoneNumberPatternOrder: { value: any; message: string } = {
  value: /^(\+?380\d{9})|(\+38 \(0\d{2}\) \d{3} \d{2} \d{2})$/,
  message: t('validation.phone'),
}
