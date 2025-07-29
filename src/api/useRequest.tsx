import ky from 'ky'
import i18n from 'i18next' // обязательно подключи i18next

interface IErrorResponse {
  error: string
}

export const request = async (
  url: string = '',
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
    body?: object
    headers?: HeadersInit
    params?: any
  },
) => {
  const currentLang = i18n.language
  const langPrefix = currentLang === 'uk' ? 'uk' : 'en'

  const api = ky.extend({
    hooks: {
      beforeRequest: [
        (request) => {
          request.headers.set('Content-type', 'application/json')
        },
      ],
    },
    prefixUrl: `https://istrongapp.com/${langPrefix}/api`,
    throwHttpErrors: false,
  })

  const requestOptions = {
    method: options.method,
    json: options.body,
    searchParams: options.params,
    headers: options.headers,
  }

  const response = await api(url, requestOptions).catch(() => {
    throw new Error('Ой, щось пішло не так!')
  })

  const text = await response.text()

  if (!response.ok) {
    try {
      const errorResponse: IErrorResponse = text ? JSON.parse(text) : { error: 'Unknown error' }
      throw new Error(errorResponse.error || 'Unknown error')
    } catch {
      throw new Error('Сервер повернув некоректну відповідь:\n' + text)
    }
  }

  return text ? JSON.parse(text) : null
}
