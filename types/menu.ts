export interface MenuModal {
    menu: boolean
    process: boolean
    favorites: boolean
    reports: boolean
    systems: boolean
    help: boolean
  }
  
  export interface FavoriteView {
    id: string
    alias: string
    name: string
    description?: string
    addedAt: string
  }
  
  export interface ProcessAction {
    id: string
    name: string
    description: string
    icon: string
    action: () => void
  }
  
  export interface ReportItem {
    id: string
    name: string
    description: string
    module: string
    lastGenerated?: string
  }
  
  export interface SystemInfo {
    version: string
    environment: string
    database: string
    lastUpdate: string
  }