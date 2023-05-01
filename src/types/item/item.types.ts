import { Item, ItemStatus, ItemVisibility } from '../../database/entities/item.entity'

export type GetItemsResponse = {
  count: number
  items: Item[]
}

export type GetItemResponse = {
  item: Item
}

export type CreateItemPayload = {
  userId: number
  title: string
  content: string
  status: ItemStatus
  visibility: ItemVisibility
}

export type CreateItemResponse = {
  id: number
}

export type UpdateItemPayload = {
  title?: string
  content?: string
  status?: ItemStatus
  visibility?: ItemVisibility
}

export type UpdateItemResponse = {
  message: string
}

export type DeleteItemResponse = {
  message: string
}