import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LIKES_MESSAGES } from '~/constants/messages'
import { LikeTweetReqBody } from '~/models/requests/Like.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import likesService from '~/services/likes.services'

export const likeTweetController = async (req: Request<ParamsDictionary, unknown, LikeTweetReqBody>, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await likesService.likeTweet(user_id, req.body.tweet_id)
  return res.json({
    message: LIKES_MESSAGES.LIKE_TWEET_SUCCESSFUL,
    result
  })
}

export const unlikeTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await likesService.unLikeTweet(user_id, req.params.tweet_id)
  return res.json({
    message: LIKES_MESSAGES.UNLIKE_TWEET_SUCCESSFUL,
    result
  })
}
