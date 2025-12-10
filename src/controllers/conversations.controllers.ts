import { Request, Response } from 'express'
import conversationsService from '~/services/conversations.services'

export const getConversationsController = async (req: Request, res: Response) => {
  const { receiver_id } = req.params
  const limit = Number(req.query.limit) || 20
  const page = Number(req.query.page) || 1
  const sender_id = req.decoded_access_token?.user_id as string
  const result = await conversationsService.getConversations({
    sender_id,
    receiver_id,
    limit,
    page
  })
  return res.json({
    message: 'Conversations fetched successfully',
    conversations: result.conversations,
    limit,
    page,
    totalPage: Math.ceil(result.total / limit)
  })
}
