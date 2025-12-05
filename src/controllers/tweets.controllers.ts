import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetRequestBody } from '~/models/requests/Tweet.requests'
import tweetsService from '~/services/tweets.services'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/User.requests'

export const createTweetController = async (
  req: Request<ParamsDictionary, any, TweetRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await tweetsService.createTweet(user_id, req.body)
  return res.json({
    message: TWEETS_MESSAGES.CREATE_TWEET_SUCCESSFUL,
    result
  })
}

export const getTweetController = async (req: Request, res: Response, next: NextFunction) => {
  const { tweet_id } = req.params
  const result = await tweetsService.getTweet(tweet_id)
  return res.json({
    message: TWEETS_MESSAGES.GET_TWEET_SUCCESSFUL,
    result
  })
}
