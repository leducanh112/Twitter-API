import { ParamsDictionary, Query } from 'express-serve-static-core'
import { Media } from '../Others'
import { TweetAudience, TweetType } from '~/constants/enums'

export interface TweetRequestBody {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id?: string
  hashtags: string[]
  mentions: string[]
  media?: Media[]
}

export interface TweetParam extends ParamsDictionary {
  tweet_id: string
}

export interface TweetQuery extends Query {
  limit: string
  page: string
  tweet_type: string
}
