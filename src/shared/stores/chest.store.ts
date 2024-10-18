import create from 'zustand'
import { persist } from 'zustand/middleware'

// Интерфейс состояния
interface ChestState {
  view: string
  setView: (view: string) => void
}

// Создаем zustand-хранилище с persist
export const useChestStore = create<ChestState>()(
  persist(
    (set) => ({
      view: 'main', // Начальное состояние
      setView: (view) => set({ view }), // Метод для обновления состояния
    }),
    {
      name: 'chest-storage', // Уникальное имя для хранения в localStorage
    },
  ),
)
