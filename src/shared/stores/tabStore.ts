// store.ts
import create from 'zustand'

interface TabStore {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const useTabStore = create<TabStore>((set) => ({
  activeTab: 'main', // начальная вкладка
  setActiveTab: (tab) => set({ activeTab: tab }),
}))
