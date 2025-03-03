const cds = require('@sap/cds')

class CatalogService extends cds.ApplicationService { init() {

  const { Books } = cds.entities('sap.capire.bookshop')
  const { ListOfBooks } = this.entities

  // Reduce stock of ordered books if available stock suffices
  this.on('submitOrder', async req => {
    let { book:id, quantity } = req.data
    let book = await SELECT.one.from (Books, id, b => b.stock)

    // Validate input data
    if (!book) return req.error (404, `Book #${id} doesn't exist`)
    if (quantity < 1) return req.error (400, `quantity has to be 1 or more`)
    if (!book.stock || quantity > book.stock) return req.error (409, `${quantity} exceeds stock for book #${id}`)

    // Reduce stock in database and return updated stock value
    await UPDATE (Books, id) .with ({ stock: book.stock -= quantity })
    return book
  })

  this.on('getStockedValue', 'Books', async ({params:[id]}) => {
    const stockedValue = (await SELECT `stock * price as stockedValue` .from (Books) .where ({ID:id}))[0].stockedValue
    return stockedValue;
  })

  this.on('getTotalStockedValue', 'Books', async (req) => {
    const totalStockedValue = (await SELECT `sum(stock * price) as stockedValue` .from (Books))[0].stockedValue
    return totalStockedValue;
  })

  // Add some discount for overstocked books
  this.after('each', ListOfBooks, book => {
    if (book.stock > 111) book.title += ` -- 11% discount!`
  })

  // Emit event when an order has been submitted
  this.after('submitOrder', async (_,req) => {
    let { book, quantity } = req.data
    await this.emit('OrderedBook', { book, quantity, buyer: req.user.id })
  })

  // Delegate requests to the underlying generic service
  return super.init()
}}

module.exports = CatalogService
