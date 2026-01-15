const cds = require('@sap/cds')

describe('AdminService', () => {
  const { GET, axios } = cds.test()

  describe('called by content-manager (cap.ContentManager policy assigned)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'content-manager', password: '' }
    })

    it('/Books should return all Books', async () => {
      const { status, data } = await GET `/admin/Books` 
      expect(status).toBe(200)
      expect(data.value?.length).toBe(5)
    })

    it('/Authors should return all Authors', async () => {
      const { status, data } = await GET `/admin/Authors` 
      expect(status).toBe(200)
      expect(data.value?.length).toBe(4)
    })
  })   
  
  describe('called by stock-manager (cap.StockManager policy assigned)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'stock-manager', password: '' }
    })

    it('/Books should return all Books', async () => {
      const { status, data } = await GET `/admin/Books` 
      expect(status).toBe(200)
      expect(data.value?.length).toBe(5)
    })

    it('/Authors should return all Authors', async () => {
      const { status, data } = await GET `/admin/Authors` 
      expect(status).toBe(200)
      expect(data.value?.length).toBe(4)
    })
  })

  describe('called by stock-manager-fiction', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'stock-manager-fiction', password: '' }
    })

    it('/Books should return 3 Books filtered by Mystery and Fantasy genres', async () => {
      const { status, data } = await GET `/admin/Books` 
      expect(status).toBe(200)
      expect(data.value?.length).toBe(3)
      expect(data.value).toContainEqual(expect.objectContaining({ title: 'Catweazle' }))
      expect(data.value).toContainEqual(expect.objectContaining({ title: 'The Raven' }))
      expect(data.value).toContainEqual(expect.objectContaining({ title: 'Eleonora' }))
    })

    it('/Authors should return all Authors', async () => {
      const { status, data } = await GET `/admin/Authors` 
      expect(status).toBe(200)
      expect(data.value?.length).toBe(4)
    })
  })

  describe('called by reader (no ManageAuthors or ManageBooks)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'reader', password: '' }
    })

    it('/Books should return status 403', async () => {
      expect.assertions(1);
      return (GET `/admin/Books`).catch(error => {
        expect(error.response.status).toBe(403)
      })
    })

    it('/Authors should return status 403', async () => {
      expect.assertions(1);
      return (GET `/admin/Authors`).catch(error => {
        expect(error.response.status).toBe(403)
      })
    })
  })

})
