const cds = require('@sap/cds')

describe('AdminService', () => {
  const { GET, axios } = cds.test ()

  describe('called by alice (admin role mocked directly but not via policy)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'alice', password: '' }
    })

    it('/Books should return all Books because the admin role is not supplied via AMS, so the AMS attribute filters do not apply.', async () => {
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
  
  describe('called by bob (cap.admin policy assigned)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'bob', password: '' }
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

  describe('called by fred (no admin)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'fred', password: '' }
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