import { Server as ioServer } from 'socket.io'
import type { Socket } from 'socket.io'
import type { Server as httpServer } from 'http'
import ProductService from '../services/ProductService'
import ChatService from '../services/ChatService'

export class SocketServer {
  // eslint-disable-next-line new-cap
  private io: ioServer = new ioServer()
  private readonly productService: ProductService
  private readonly chatService: ChatService

  constructor(server: any) {
    this.initWsServer(server)
    this.productService = ProductService.getInstance()
    this.chatService = ChatService.getInstance()
    this.init()
  }

  private initWsServer(app: httpServer): void {
    // eslint-disable-next-line new-cap
    this.io = new ioServer(app, {})
  }

  private init(): void {
    this.io.on('connection', async (socket: Socket) => {
      console.log('New connection received')
      socket.emit('products', await this.productService.getProducts(1, 10))
      socket.emit('messages', await this.chatService.getAllMsgs())

      socket.on('productSaved', async () => {
        this.io.emit('products', await this.productService.getProducts(1, 10))
      })

      socket.on('productDeleted', async () => {
        this.io.emit('products', await this.productService.getProducts(1, 10))
      })

      socket.on('msgSent', async (data: string): Promise<void> => {
        await this.chatService.saveMsg(data)
        this.io.emit('messages', await this.chatService.getAllMsgs())
      })

      socket.on('disconnect', () => {
        console.log('User disconnected')
      })
    })
  }
}
