import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { Pagination, TweetParam, TweetQuery, TweetRequestBody } from '~/models/requests/Tweet.requests'
import tweetsService from '~/services/tweets.services'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/User.requests'

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestBody>, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await tweetsService.createTweet(user_id, req.body)
  return res.json({
    message: TWEETS_MESSAGES.CREATE_TWEET_SUCCESSFUL,
    result
  })
}

export const getTweetController = async (req: Request, res: Response) => {
  const result = await tweetsService.increaseView(req.params.tweet_id, req.decoded_access_token?.user_id)
  const tweet = {
    ...req.tweet,
    guest_views: result?.guest_views,
    user_views: result?.user_views,
    updated_at: result?.updated_at
  }
  console.log(result)
  return res.json({
    message: TWEETS_MESSAGES.GET_TWEET_SUCCESSFUL,
    result: tweet
  })
}

export const getTweetChildrenController = async (req: Request<TweetParam, any, any, TweetQuery>, res: Response) => {
  const tweet_type = parseInt(req.query.tweet_type as string) || 2
  const limit = parseInt(req.query.limit as string) || 10
  const page = parseInt(req.query.page as string) || 1
  const user_id = req.decoded_access_token?.user_id

  const { total, tweets } = await tweetsService.getTweetChildren({
    tweet_id: req.params.tweet_id,
    tweet_type,
    limit,
    page,
    user_id
  })
  const totalPages = Math.ceil(total / limit)
  return res.json({
    message: TWEETS_MESSAGES.GET_TWEET_CHILDREN_SUCCESSFUL,
    result: {
      tweets,
      tweet_type,
      totalPages,
      limit,
      page
    }
  })
}

export const getNewFeedsController = async (req: Request<ParamsDictionary, any, any, Pagination>, res: Response) => {
  const user_id = req.decoded_access_token?.user_id as string
  const limit = parseInt(req.query.limit as string) || 10
  const page = parseInt(req.query.page as string) || 1
  const result = await tweetsService.getNewFeeds({
    user_id,
    limit,
    page
  })
  return res.json({
    message: TWEETS_MESSAGES.GET_NEW_FEEDS_SUCCESSFUL,
    result: { tweets: result.tweets, limit, page, total_page: Math.ceil(result.total / limit) }
  })
}
