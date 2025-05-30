export const required = 'Обов’язкове поле'

export const lengthPattern: { value: any; message: string } = {
  value: /^.{2,255}$/,
  message: 'Від 2 до 30 символів',
}

export const phoneNumberPattern = {
  value: /^\+[1-9]\d{9,14}$/,
  message: 'Переконайся у правильності введеного номеру',
}

export const passwordPattern: { value: any; message: string } = {
  // value: /^(?=\s*\S*[0-9]\S*\s*$)(?=\s*\S*[a-zA-Z]\S*\s*$)[a-zA-Z0-9@#$_&+()/]{8,15}$/,
  value: /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&()#_+]{8,15}$/,
  message:
    'Від 8 до 15 символів без пробілів, латинські літери, цифри, щонайменше одна літера і одна цифра',
}

export const namePattern: { value: any; message: string } = {
  value: /^(?=(?:.*[^\s]){2})[\wа-яА-ЯЇїІіЄєҐґ\d\s.`\-_'’]{2,30}$/,
  message: 'Від 2 до 30 символів, допустимі літери, цифри та символи: . ’ ` - _',
}

export const pinPattern: { value: any; message: string } = {
  value: /^\d{4}$/,
  message: 'Має бути 4 цифри без пробілів',
}

export const phoneNumberPatternOrder: { value: any; message: string } = {
  value: /^(\+?380\d{9})|(\+38 \(0\d{2}\) \d{3} \d{2} \d{2})$/,
  message: 'Переконайся у правильності введеного номеру',
}
