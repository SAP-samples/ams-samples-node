const cds = require('@sap/cds')

describe('AmsValueHelpService', () => {
  const { GET, axios } = cds.test()

  describe('called by fred (no admin)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'fred', password: '' }
    })

    it('/Genres should return status 403', async () => {
      expect.assertions(1);
      return (GET`/odata/v4/ams-value-help/Genres`).catch(error => {
        expect(error.response.status).toBe(403)
      })
    })
  })

  describe('called by amsValueHelp (admin)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'amsValueHelp', password: '' }
    })

    it('/Genres should return all Genres', async () => {
      const { status, data } = await GET`/odata/v4/ams-value-help/Genres`
      expect(status).toBe(200)
      expect(data.value?.length).toBe(15)
    })
  })

})
