import { Request, Response } from 'express'

import { StatusCode } from '../types/http-status-codes'

import itemService from '../services/item.service'
import { ItemStatus, ItemVisibility } from '../database/entities/item.entity'

/**
 * Handles request to retrieve the filtered, sorted, and paginated list of the user's items
 * @param req The request object
 * @param res The response object
 */
export async function listItems(req: Request, res: Response): Promise<void> {
  try {
    // Verify user was set
    if (!req.user) {
      throw new Error('An unexpected error occurred. Could not identify user.')
    }

    // Get all qs options
    const queryObj = { ...req.query }

    // Get the item properties to filter by
    // Note: Excluding filtering by create/updated at date for now
    const excludedFields = ['page', 'sort', 'limit']
    excludedFields.forEach(x => delete queryObj[x])

    // Build qs for where clause
    const queryString = JSON.stringify(queryObj)

    const response = await itemService.getItems(req.user.id, {
      page: Number(req.query?.page),
      limit: Number(req.query?.limit),
      sort: String(req.query?.sort),
      where: queryString,
    })

    res.status(StatusCode.OK).json(response)
  } catch (err) {
    console.error(err)
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch list of items.' })
  }
}

/**
 * Handles request to get an item by ID
 * @param req The request object
 * @param res The response object
 */
export async function getItemById(req: Request, res: Response): Promise<void> {
  try {
    // Verify user was set
    if (!req.user) {
      throw new Error('An unexpected error occurred. Could not identify user.')
    }

    // Get params
    const { id } = req.params
    const itemId = parseInt(id)

    const response = await itemService.getItemById(itemId, req.user.id)

    if (response.result === 'success') {
      res.status(StatusCode.OK).json(response.value)
    } else {
      res.status(response.statusCode).json(response.error)
    }
  } catch (err) {
    console.error(err)
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch item.' })
  }
}

/**
 * Handles request to create a new item
 * @param req The request object
 * @param res The response object
 */
export async function createItem(req: Request, res: Response): Promise<void> {
  try {
    // Verify user was set
    if (!req.user) {
      throw new Error('An unexpected error occurred. Could not identify user.')
    }

    // Get req body
    const { title, description, status, visibility } = req.body

    const response = await itemService.createItem({
      userId: req.user.id,
      title: title,
      description: description,
      status: <ItemStatus>status,
      visibility: <ItemVisibility>visibility,
    })

    if (response.result === 'success') {
      res.status(StatusCode.CREATED).json(response.value)
    } else {
      res.status(response.statusCode).json(response.error)
    }
  } catch (err) {
    console.error(err)
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to save item.' })
  }
}

/**
 * Handles request to update an item by ID
 * @param req The request object
 * @param res The response object
 */
export async function updateItem(req: Request, res: Response): Promise<void> {
  try {
    // Verify user was set
    if (!req.user) {
      throw new Error('An unexpected error occurred. Could not identify user.')
    }

    // Get params
    const { id } = req.params
    const itemId = parseInt(id)

    const response = await itemService.updateItem(itemId, req.user.id, {
      title: req.body?.title,
      description: req.body?.description,
      status: req.body?.status,
      visibility: req.body?.visibility,
    })

    if (response.result === 'success') {
      res.status(StatusCode.OK).json(response.value)
    } else {
      res.status(response.statusCode).json(response.error)
    }
  } catch (err) {
    console.error(err)
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update item.' })
  }
}

/**
 * Handles request to delete an item by ID
 * @param req The request object
 * @param res The response object
 */
export async function deleteItem(req: Request, res: Response): Promise<void> {
  try {
    // Verify user was set
    if (!req.user) {
      throw new Error('An unexpected error occurred. Could not identify user.')
    }

    // Get params
    const { id } = req.params
    const itemId = parseInt(id)

    const response = await itemService.deleteItem(itemId, req.user.id)

    if (response.result === 'success') {
      res.status(StatusCode.OK).json(response.value)
    } else {
      res.status(response.statusCode).json(response.error)
    }
  } catch (err) {
    console.error(err)
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete item.' })
  }
}

export default {
  getItemById,
  listItems,
  createItem,
  updateItem,
  deleteItem,
}
