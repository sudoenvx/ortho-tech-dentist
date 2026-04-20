export interface Website {
  id: string
  name: string
  link?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface NewWebsiteInput {
  name: string
  link?: string
  isActive: boolean
}
