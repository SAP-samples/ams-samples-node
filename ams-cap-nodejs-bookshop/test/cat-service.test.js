const cds = require('@sap/cds')

describe('CatalogService', () => {
  const { GET, axios } = cds.test()

  describe('called by reader (cap.Reader policy assigned)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'reader', password: '' }
    })

    it('/Books should return all Books', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books`
      expect(status).toBe(200)
      expect(data.value?.length).toBe(5)
    })

    it('/ListOfBooks should return all Books', async () => {
      const { status, data } = await GET`/odata/v4/catalog/ListOfBooks`
      expect(status).toBe(200)
      expect(data.value?.length).toBe(5)
    })

    it('/Books/271/getStockedValue() should return 3300', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books/271/getStockedValue()`
      expect(status).toBe(200)
      expect(data.value).toBe(3300)
    })

    it('/Books/getTotalStockedValue() should return 15711.35', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books/getTotalStockedValue()`
      expect(status).toBe(200)
      expect(data.value).toBe(15711.35)
    })
  })

  describe('called by juniorReader (local.JuniorReader policy assigned)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'juniorReader', password: '' }
    })

    /**
     * The JuniorReader policy restricts to Fairy Tale, Fantasy, and Mystery genres:
     * - access to Catweazle is granted as its genre is Fantasy
     * - access to The Raven and Eleonora is granted as their genre is Mystery
     * - Fairy Tale books would also be included but there are none in the data
     */
    it('/Books should return 3 Books (Catweazle, The Raven, Eleonora)', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books`
      expect(status).toBe(200)
      expect(data.value?.length).toBe(3)
      expect(data.value).toContainEqual(expect.objectContaining({ title: 'Catweazle' }))
      expect(data.value).toContainEqual(expect.objectContaining({ title: 'The Raven' }))
      expect(data.value).toContainEqual(expect.objectContaining({ title: 'Eleonora' }))
    })

    // Book 201 = Wuthering Heights (Drama genre - not allowed)
    it('/Books/201/getStockedValue() should be forbidden', async () => {
      expect.hasAssertions();
      return (GET`/odata/v4/catalog/Books/201/getStockedValue()`).catch(error => {
        expect(error.response.status).toBe(403)
      })
    })

    // Book 271 = Catweazle (Fantasy genre - allowed)
    it('/Books/271/getStockedValue() should return 3300', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books/271/getStockedValue()`
      expect(status).toBe(200)
      expect(data.value).toBe(3300)
    })

    // 15711.35 = stocked value over ALL books because instance-based filters are NOT supported by CAP for functions bound to more than one entity
    it('/Books/getTotalStockedValue() should return 15711.35', async () => {
      expect.hasAssertions();
      const { status, data } = await GET`/odata/v4/catalog/Books/getTotalStockedValue`
      expect(status).toBe(200)
      expect(data.value).toBe(15711.35)
    })
  })

  describe('called by technicalUser (calling ReadCatalog API policy)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'technicalUser', password: '' }
    })

    /**
     * The ReadCatalog API policy restricts to genres NOT IN (Mystery, Romance, Thriller, Dystopia)
     * The remaining list includes Drama (Wuthering Heights, Jane Eyre) and Fantasy (Catweazle)
     */
    it('/Books should return 3 Books (Catweazle, Wuthering Heights, Jane Eyre)', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books`
      expect(status).toBe(200)
      expect(data.value?.length).toBe(3)
      expect(data.value).toContainEqual(expect.objectContaining({ title: 'Catweazle' }))
      expect(data.value).toContainEqual(expect.objectContaining({ title: 'Wuthering Heights' }))
      expect(data.value).toContainEqual(expect.objectContaining({ title: 'Jane Eyre' }))
    })

    // Book 252 = Eleonora (Mystery genre - forbidden by ReadCatalog policy)
    it('/Books/252/getStockedValue() should be forbidden', async () => {
      expect.hasAssertions();
      return (GET`/odata/v4/catalog/Books/252/getStockedValue()`).catch(error => {
        expect(error.response.status).toBe(403)
      })
    })

    // Book 271 = Catweazle (Fantasy genre - allowed by ReadCatalog policy)
    it('/Books/271/getStockedValue() should return 3300', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books/271/getStockedValue()`
      expect(status).toBe(200)
      expect(data.value).toBe(3300)
    })
  })

  describe('called by principalPropagation (local.JuniorReader policy limited to ReadCatalog API policy)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'principalPropagation', password: '' }
    })

    /**
     * The JuniorReader policy restricts to Fairy Tale, Fantasy, and Mystery genres
     * The ReadCatalog API policy restricts to genres NOT IN (Mystery, Romance, Thriller, Dystopia)
     * The intersection yields only Fantasy genre books (Mystery is excluded by ReadCatalog), which is Catweazle
     */
    it('/Books should return 1 Book (Catweazle)', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books`
      expect(status).toBe(200)
      expect(data.value?.length).toBe(1)
      expect(data.value).toContainEqual(expect.objectContaining({ title: 'Catweazle' }))
    })

    // Book 252 = Eleonora (Mystery genre - allowed by JuniorReader but forbidden by ReadCatalog API policy)
    it('/Books/252/getStockedValue() should be forbidden', async () => {
      expect.hasAssertions();
      return (GET`/odata/v4/catalog/Books/252/getStockedValue()`).catch(error => {
        expect(error.response.status).toBe(403)
      })
    })

    // Book 271 = Catweazle (Fantasy genre - allowed by both policies)
    it('/Books/271/getStockedValue() should return 3300', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books/271/getStockedValue()`
      expect(status).toBe(200)
      expect(data.value).toBe(3300)
    })
  })

})
