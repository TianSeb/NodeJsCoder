import { Server as ioServer, Socket } from 'socket.io'
import { Server as httpServer } from 'http'
import ProductManager from '../services/ProductManager'
import ChatManager from '../services/ChatManager'

export class SocketServer {

    private io: ioServer = new ioServer
    private productManager: ProductManager
    private chatManager: ChatManager

    constructor(server: any) {
        this.initWsServer(server)
        this.productManager = ProductManager.getInstance()
        this.chatManager = ChatManager.getInstance()
        this.init()
    }

    private initWsServer(app: httpServer): void {
        this.io = new ioServer(app, {})
    }

    private init(): void {
        this.io.on('connection', async (socket: Socket) => {
            console.log('New connection received')
            socket.emit('products', await this.productManager.getProducts(1,10))
            socket.emit('messages', await this.chatManager.getAllMsgs())

            socket.on("productSaved", async () => {        
                this.io.emit("products", await this.productManager.getProducts(1,10))
            })

            socket.on("productDeleted", async () => {        
                this.io.emit("products", await this.productManager.getProducts(1,10))
            })

            socket.on("msgSent", async (data:string): Promise<void> => {
                await this.chatManager.saveMsg(data)
                this.io.emit("messages", await this.chatManager.getAllMsgs())
            })

            socket.on("disconnect", () => {
                console.log("User disconnected")
            })
        })
    }
}