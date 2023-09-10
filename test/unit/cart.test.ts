import TicketManagerMongo from '../../src/persistence/mongo/manager/TicketManagerMongo'
import { TicketModel } from '../../src/persistence/mongo/models/Ticket'
import assert from 'assert'

jest.mock('../../src/persistence/mongo/models/Ticket')
const ticketManager = new TicketManagerMongo()

describe('createTicket', () => {
  it('will create ticket when passing params', async () => {
    const amount = 100
    const userEmail = 'test@example.com'
    const products = [
      {
        name: 'test',
        price: 200,
        total: 400,
        qty: 2
      }
    ]
    TicketModel.prototype.save.mockResolvedValueOnce({
      code: '23423422',
      amount: amount,
      purchaser: userEmail,
      products: products
    })

    const result = await ticketManager.createTicket(amount, userEmail, products)

    expect(result).toBeDefined()
    assert.equal(result.amount, amount)
  })
})
