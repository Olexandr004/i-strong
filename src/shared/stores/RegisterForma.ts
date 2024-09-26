import create from 'zustand'

interface FormState {
  formData: {
    username: string
    phone_number: string
    password: string
  }
  setFormData: (data: Partial<FormState['formData']>) => void
}

export const useFormStore = create<FormState>((set) => ({
  formData: {
    username: '',
    phone_number: '',
    password: '',
  },
  setFormData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    })),
}))
