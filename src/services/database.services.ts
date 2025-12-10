import { Collection, Db, MongoClient } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Follower from '~/models/schemas/Followers.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import Hashtag from '~/models/schemas/Hashtag.schema'
import Bookmark from '~/models/schemas/Bookmark.schema'
import Like from '~/models/schemas/Like.schema'
import Conversation from '~/models/schemas/Conversations.schema'

config()
const uri = process.env.DB_URI || 'mongodb://127.0.0.1:27017'

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      await this.client.connect()
      console.log('✅ Connected successfully to MongoDB')
      await this.createCollectionsIfNotExist()
    } catch (err) {
      console.error('❌ MongoDB connection error:', err)
    }
  }

  private async createCollectionsIfNotExist() {
    try {
      const collections = await this.db.listCollections().toArray()
      const collectionNames = collections.map(c => c.name)

      const requiredCollections = [
        process.env.DB_USERS_COLLECTION,
        process.env.DB_REFRESH_TOKENS_COLLECTION,
        process.env.DB_FOLLOWERS_COLLECTION,
        process.env.DB_TWEETS_COLLECTION,
        process.env.DB_HASHTAGS_COLLECTION,
        process.env.DB_BOOKMARKS_COLLECTION,
        process.env.DB_LIKES_COLLECTION,
        process.env.DB_CONVERSATIONS_COLLECTION
      ]

      for (const collectionName of requiredCollections) {
        if (collectionName && !collectionNames.includes(collectionName)) {
          await this.db.createCollection(collectionName)
          console.log(`✅ Created collection: ${collectionName}`)
        }
      }
    } catch (err) {
      console.warn('⚠️ Error creating collections:', err)
    }
  }

  async indexUsers() {
    try {
      const exists = await this.users.indexExists(['email_1_password_1', 'email_1', 'username_1'])
      if (!exists) {
        this.users.createIndex({ email: 1, password: 1 })
        this.users.createIndex({ email: 1 }, { unique: true })
      }
    } catch (err) {
      console.warn('⚠️ Could not create indexes for users collection:', err)
    }
  }

  async indexRefreshTokens() {
    const exists = await this.refreshTokens.indexExists(['token_1', 'exp_1'])
    if (!exists) {
      this.refreshTokens.createIndex({ token: 1 })
      this.refreshTokens.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
    }
  }

  async indexFollowers() {
    const exists = await this.followers.indexExists(['user_id_1_followed_user_id_1'])
    if (!exists) {
      this.followers.createIndex({ user_id: 1, followed_user_id: 1 })
    }
  }

  async indexTweets() {
    const exists = await this.tweets.indexExists(['user_id_1', 'content_text'])
    if (!exists) {
      this.tweets.createIndex({ user_id: 1 })
      this.tweets.createIndex({ content: 'text' }, { default_language: 'none' })
    }
  }

  async indexHashtags() {
    const exists = await this.hashtags.indexExists(['name_1'])
    if (!exists) {
      this.hashtags.createIndex({ name: 1 })
    }
  }

  async indexBookmarks() {
    const exists = await this.bookmarks.indexExists(['user_id_1_tweet_id_1'])
    if (!exists) {
      this.bookmarks.createIndex({ user_id: 1, tweet_id: 1 })
    }
  }

  async indexLikes() {
    const exists = await this.likes.indexExists(['user_id_1_tweet_id_1'])
    if (!exists) {
      this.likes.createIndex({ user_id: 1, tweet_id: 1 })
    }
  }

  get users(): Collection<User> {
    return this.db.collection<User>(process.env.DB_USERS_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection<RefreshToken>(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  get followers(): Collection<Follower> {
    return this.db.collection<Follower>(process.env.DB_FOLLOWERS_COLLECTION as string)
  }

  get tweets(): Collection<Tweet> {
    return this.db.collection<Tweet>(process.env.DB_TWEETS_COLLECTION as string)
  }

  get hashtags(): Collection<Hashtag> {
    return this.db.collection<Hashtag>(process.env.DB_HASHTAGS_COLLECTION as string)
  }

  get bookmarks(): Collection<Bookmark> {
    return this.db.collection<Bookmark>(process.env.DB_BOOKMARKS_COLLECTION as string)
  }

  get likes(): Collection<Like> {
    return this.db.collection<Like>(process.env.DB_LIKES_COLLECTION as string)
  }
  get conversations(): Collection<Conversation> {
    return this.db.collection<Conversation>(process.env.DB_CONVERSATIONS_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
