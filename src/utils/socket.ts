import { Server } from 'socket.io'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import Conversation from '~/models/schemas/Conversations.schema'
import { Server as HTTPServer } from 'http'

const initSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  })
  const users: {
    [key: string]: {
      socket_id: string
    }
  } = {}
  io.on('connection', (socket) => {
    console.log(socket.id, 'connected')
    const user_id = socket.handshake.auth._id
    users[user_id] = {
      socket_id: socket.id
    }
    console.log(users)
    socket.on('private message', async (data) => {
      const receiver_socket_id = users[data.to]?.socket_id
      if (!receiver_socket_id) return

      await databaseService.conversations.insertOne(
        new Conversation({
          sender_id: new ObjectId(data.from),
          receiver_id: new ObjectId(data.to),
          content: data.content
        })
      )
      io.to(receiver_socket_id).emit('receive private message', {
        from: user_id,
        content: data.content
      })
    })
    socket.on('disconnect', () => {
      console.log(socket.id, 'disconnected')
      delete users[user_id]
    })
  })
}
export default initSocket
