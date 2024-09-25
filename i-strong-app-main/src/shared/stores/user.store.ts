import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface IState {
  user: {
    id: number
    name: string
    phone_number: string
    access_token: string
    coins: number
    avatar: string | null
    mood: {
      mood: string
      date: string
    }
    has_dairy_password: boolean
    activity: {
      challenges_visited: boolean
      diary_visited: boolean
      id: number
      instructions_visited: boolean
      mood_stats_visited: boolean
      shop_visited: boolean
    }
  } | null
}

interface IStore extends IState {
  handleChangeUserStore: (value: Partial<IState>) => void
}

// global store
export const useUserStore = create<IStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        handleChangeUserStore: (value) => set((state) => ({ ...state, ...value })),
      }),
      { name: 'user_store', version: 1 },
    ),
    { enabled: process.env.NODE_ENV !== 'production' },
  ),
)
