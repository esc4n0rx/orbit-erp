'use client'

import { useState } from 'react'
import type { MenuModal } from '@/types/menu'

export function useTopMenu() {
  const [openModals, setOpenModals] = useState<MenuModal>({
    menu: false,
    process: false,
    favorites: false,
    reports: false,
    systems: false,
    help: false
  })

  const openModal = (modalName: keyof MenuModal) => {
    setOpenModals(prev => ({
      ...prev,
      [modalName]: true
    }))
  }

  const closeModal = (modalName: keyof MenuModal) => {
    setOpenModals(prev => ({
      ...prev,
      [modalName]: false
    }))
  }

  const closeAllModals = () => {
    setOpenModals({
      menu: false,
      process: false,
      favorites: false,
      reports: false,
      systems: false,
      help: false
    })
  }

  return {
    openModals,
    openModal,
    closeModal,
    closeAllModals
  }
}