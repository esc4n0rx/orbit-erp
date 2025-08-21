'use client'

import React, { forwardRef, useImperativeHandle } from 'react'
import { useTopMenu } from '@/hooks/useTopMenu'
import { MenuModal } from './MenuModal'
import { ProcessModal } from './ProcessModal'
import { FavoritesModal } from './FavoritesModal'
import { ReportsModal } from './ReportsModal'
import { SystemsModal } from './SystemsModal'
import { HelpModal } from './HelpModal'
import type { User } from '@/types/auth'

interface TopMenuHandlerProps {
  user: User
  onViewSelect: (viewId: string, title: string) => void
}

export interface TopMenuHandlerRef {
  openModal: (modalName: 'menu' | 'process' | 'favorites' | 'reports' | 'systems' | 'help') => void
}

export const TopMenuHandler = forwardRef<TopMenuHandlerRef, TopMenuHandlerProps>(
  function TopMenuHandler({ user, onViewSelect }, ref) {
    const { openModals, openModal, closeModal } = useTopMenu()

    useImperativeHandle(ref, () => ({
      openModal
    }), [openModal])

    return (
      <>
        {/* Menu de Módulos e Views */}
        <MenuModal
          open={openModals.menu}
          onClose={() => closeModal('menu')}
          user={user}
          onViewSelect={onViewSelect}
        />

        {/* Modal de Processamento */}
        <ProcessModal
          open={openModals.process}
          onClose={() => closeModal('process')}
          user={user}
        />

        {/* Modal de Favoritos */}
        <FavoritesModal
          open={openModals.favorites}
          onClose={() => closeModal('favorites')}
          user={user}
          onViewSelect={onViewSelect}
        />

        {/* Modal de Relatórios */}
        <ReportsModal
          open={openModals.reports}
          onClose={() => closeModal('reports')}
          user={user}
        />

        {/* Modal de Sistemas */}
        <SystemsModal
          open={openModals.systems}
          onClose={() => closeModal('systems')}
          user={user}
        />

        {/* Modal de Ajuda */}
        <HelpModal
          open={openModals.help}
          onClose={() => closeModal('help')}
          user={user}
        />
      </>
    )
  }
)