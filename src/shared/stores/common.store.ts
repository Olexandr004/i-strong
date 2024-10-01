import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { ReactNode } from 'react'

import { ChallengeType } from '@/interfaces/challenge'
import { ISignUp } from '@/interfaces/entry'

// Определите интерфейсы состояния и методов
interface IState {
  avatarImage: string | null
  errorText: null | string
  successfulText: null | string
  entryType: 'signIn' | 'signUp'
  isModalActive: boolean
  modalContent: null | ReactNode
  activeChallengeTypeButton: ChallengeType
  registerForm: Partial<ISignUp> | null
  isAgreedForm: boolean
}

interface IStore extends IState {
  handleChangeCommonStore: (value: Partial<IState>) => void
}

// Добавьте persist в общий store
export const useCommonStore = create<IStore>()(
  persist(
    devtools(
      (set) => ({
        avatarImage: null,
        errorText: null,
        successfulText: null,
        entryType: 'signIn',
        isModalActive: false,
        modalContent: null,
        activeChallengeTypeButton: 'new',
        registerForm: null,
        isAgreedForm: false,
        handleChangeCommonStore: (value) => set((state) => ({ ...state, ...value })),
      }),
      { enabled: process.env.NODE_ENV !== 'production' },
    ),
    {
      name: 'common-store', // имя ключа в локальном хранилище
      getStorage: () => localStorage, // используйте локальное хранилище
    },
  ),
)

interface UserCodeState {
  userData: IState | null
  setUserData: (data: IState) => void
  clearUserData: () => void
}

export const useUserCodeStore = create<UserCodeState>((set) => ({
  userData: null,
  setUserData: (data: IState) => set({ userData: data }),
  clearUserData: () => set({ userData: null }),
}))
