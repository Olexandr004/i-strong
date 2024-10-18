import create from 'zustand'
import { persist } from 'zustand/middleware'

interface TutorialsState {
  selectedCategory: number | null
  selectedTechnique: number | null
  expandedTechnique: number | null
  setSelectedCategory: (category: number | null) => void
  setSelectedTechnique: (technique: number | null) => void
  setExpandedTechnique: (technique: number | null) => void
}

// Создаем Zustand-хранилище с persist
export const useTutorialsStore = create<TutorialsState>()(
  persist(
    (set) => ({
      selectedCategory: null,
      selectedTechnique: null,
      expandedTechnique: null,
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedTechnique: (technique) => set({ selectedTechnique: technique }),
      setExpandedTechnique: (technique) => set({ expandedTechnique: technique }),
    }),
    {
      name: 'tutorials-store', // Имя для сохранения состояния
    },
  ),
)
