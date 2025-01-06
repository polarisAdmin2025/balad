import { create } from 'zustand'

const intializeState = {
  currentStep: 1,
  currentSubStep: 1,
  ICLApp: undefined
}

const useStore = create(set => ({
  ...intializeState,

  // currentStep slice
  setCurrentStep: newCurrentStep => set({ currentStep: newCurrentStep }),

  // currentSubStep slice
  setCurrentSubStep: newCurrentSubStep =>
    set({ currentSubStep: newCurrentSubStep }),

  // iclApp slice
  setICLApp: (key, value) =>
    set(state => ({
      ICLApp: {
        ...(state.ICLApp || {}),
        [key]: value
      }
    })),

  // iclApp update slice
  updateICLApp: (key, index, field, value) =>
    set(state => {
      const currentArray = state.ICLApp[key] || []
      currentArray[index] = { ...currentArray[index], [field]: value }
      return {
        ICLApp: { ...state.ICLApp, [key]: currentArray }
      }
    })
}))

export const useModal = create(set => ({
  isOpen: false,
  showModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false })
}))

export default useStore
