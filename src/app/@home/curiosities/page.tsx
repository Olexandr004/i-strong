'use client'
import { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { ButtonComponent } from '@/shared/components'

// page
const CuriositiesPage: NextPage = () => {
  const router = useRouter()

  const handleBack = () => {
    router.back() // Возвращает на предыдущую страницу
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: '2.5rem',
      }}
    >
      <h1
        style={{
          fontSize: '20px',
          fontWeight: '700',
        }}
      >
        Капібарі треба трошки часу, щоб приготувати щось дуууже класне!
      </h1>
      <img src='/image/wait-capi.png' alt='wait' />
      <ButtonComponent onClick={handleBack}>Назад</ButtonComponent>
    </div>
  )
}

export default CuriositiesPage
