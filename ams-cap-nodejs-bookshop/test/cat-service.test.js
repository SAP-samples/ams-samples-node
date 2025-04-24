const cds = require('@sap/cds')

describe('CatalogService', () => {
  const { GET, axios } = cds.test()

  describe('called by alice (no Reader)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'alice', password: '' }
    })

    it('/Books should return status 403', async () => {
      expect.assertions(1);
      return (GET`/odata/v4/catalog/Books`).catch(error => {
        expect(error.response.status).toBe(403)
      })
    })
  })

  describe('called by carol (Reader role mocked directly but not via policy)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'carol', password: '' }
    })

    it('/Books should return all Books', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books`
      expect(status).toBe(200)
      expect(data.value?.length).toBe(5)
    })
  })

})