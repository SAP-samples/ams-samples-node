const cds = require('@sap/cds')

describe('AmsValueHelpService', () => {
  const { GET, axios } = cds.test()

  describe('called by reader (no ValueHelpUser)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'reader', password: '' }
    })

    it('/Genres should return status 403', async () => {
      expect.assertions(1);
      return (GET`/odata/v4/ams-value-help/Genres`).catch(error => {
        expect(error.response.status).toBe(403)
      })
    })
  })

  describe('called by content-manager (cap.ContentManager policy grants ValueHelpUser)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'content-manager', password: '' }
    })

    it('/Genres should return all Genres', async () => {
      const { status, data } = await GET`/odata/v4/ams-value-help/Genres`
      expect(status).toBe(200)
      expect(data.value?.length).toBe(15)
    })
  })

  describe('called by amsValueHelp (internal AMS_ValueHelp API policy grants ValueHelpUser)', () => {
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
