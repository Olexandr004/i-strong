import ky from 'ky'

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
  const api = ky.extend({
    hooks: {
      beforeRequest: [
        (request) => {
          request.headers.set('Content-type', 'application/json')
        },
      ],
    },
    // prefixUrl: 'http://3.127.105.97:8080/api',
    prefixUrl: 'https://istrongapp.com/api',
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
  if (!response.ok) {
    const errorResponse = (await response.json()) as IErrorResponse
    throw new Error(errorResponse.error)
  }
  return await response.json()
}
