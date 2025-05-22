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

    it('/ListOfBooks should return status 403', async () => {
      expect.assertions(1);
      return (GET`/odata/v4/catalog/ListOfBooks`).catch(error => {
        expect(error.response.status).toBe(403)
      })
    })
  })

  describe('called by bob (cap.Reader policy assigned)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'bob', password: '' }
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

  describe('called by carol (cap.Zealot policy assigned)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'carol', password: '' }
    })

    /**
     * - access to The Raven is granted as its description contains religious references
     */
    it('/Books should return 1 Book (The Raven)', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books`
      expect(status).toBe(200)
      expect(data.value?.length).toBe(1)
      expect(data.value[0].title).toEqual('The Raven')
    })

    /**
     * On /ListOfBooks, the AMS description attribute is not mapped to a cds element, so access to The Raven is forbidden
     */
    it('/ListOfBooks should return 403 because the AMS description attribute is not mapped to a cds element', async () => {
      expect.hasAssertions();
      return (GET`/odata/v4/catalog/ListOfBooks`).catch(error => {
        expect(error.response.status).toBe(403)
      });
    })
  })

  describe('called by dave (cap.JuniorReader policy assigned)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'dave', password: '' }
    })

    /**
     * The JuniorReader policy adds attribute filters with an OR condition to the query:
     * - access to Eleonora is granted as its description hints at a happy ending
     * - access to Catweazle is granted as its genre is Fantasy
     */
    it('/Books should return 2 Books (Eleonora, Catweazle)', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books`
      expect(status).toBe(200)
      expect(data.value?.length).toBe(2)
      expect(data.value).toContainEqual(expect.objectContaining({ title: 'Eleonora' }))
      expect(data.value).toContainEqual(expect.objectContaining({ title: 'Catweazle' }))
    })

    /**
     * On /ListOfBooks, the AMS description attribute is not mapped to a cds element, so access to Eleonora is forbidden
     */
    it('/ListOfBooks should return 1 Book (Catweazle)', async () => {
      const { status, data } = await GET`/odata/v4/catalog/ListOfBooks`
      expect(status).toBe(200)
      expect(data.value?.length).toBe(1)
      expect(data.value).toContainEqual(expect.objectContaining({ title: 'Catweazle' }))
    })

    // Book 201 = Wuthering Heights
    it('/Books/201/getStockedValue() should be forbidden', async () => {
      expect.hasAssertions();
      return (GET`/odata/v4/catalog/Books/201/getStockedValue()`).catch(error => {
        expect(error.response.status).toBe(403)
      })
    })

    // Book 252 = Eleonora
    it('/Books/252/getStockedValue() should return 7770', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books/252/getStockedValue()`
      expect(status).toBe(200)
      expect(data.value).toBe(7770)
    })

    // 15711.35 = stocked value over ALL books because instance-based filters are NOT supported by CAP for functions bound to more than one entity
    it('/Books/getTotalStockedValue() should return 15711.35', async () => {
      expect.hasAssertions();
      const { status, data } = await GET`/odata/v4/catalog/Books/getTotalStockedValue`
      expect(status).toBe(200)
      expect(data.value).toBe(15711.35)
    })
  })

  describe('called by erin (BestsellerReader)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'erin', password: '' }
    })

    it('/Books should return 2 Books (Wuthering Heights, Jane Eyre)', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books`
      expect(status).toBe(200)
      expect(data.value?.length).toBe(2)
      const bookTitles = data.value.map(book => book.title)
      expect(bookTitles).toContain('Wuthering Heights')
      expect(bookTitles).toContain('Jane Eyre')
    })

    it('/ListOfBooks should return 2 Books (Wuthering Heights, Jane Eyre)', async () => {
      const { status, data } = await GET`/odata/v4/catalog/ListOfBooks`
      expect(status).toBe(200)
      expect(data.value?.length).toBe(2)
      const bookTitles = data.value.map(book => book.title)
      expect(bookTitles).toContain('Wuthering Heights')
      expect(bookTitles).toContain('Jane Eyre')
    })
  })

  describe('called by fred (Zealot, BestsellerReader)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'fred', password: '' }
    })

    /**
     * Combination of two policies with different attribute filters should yield union of both result sets:
     * - via Zealot policy access to The Raven is granted as its description contains religious references
     * - via BestsellerReader policy access to Wuthering Heights and Jane Eyre is granted as they are low on stock
     */
    it('/Books should return 3 Books (Wuthering Heights, Jane Eyre, The Raven)', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books`
      expect(status).toBe(200)
      expect(data.value?.length).toBe(3)
      const bookTitles = data.value.map(book => book.title)
      expect(bookTitles).toContain('Wuthering Heights')
      expect(bookTitles).toContain('Jane Eyre')
      expect(bookTitles).toContain('The Raven')
    })

    /**
     * On /ListOfBooks, the AMS description attribute is not mapped to a cds element, so access via the Zealot policy is forbidden
     */
    it('/ListOfBooks should return 2 Books (Wuthering Heights, Jane Eyre)', async () => {
      const { status, data } = await GET`/odata/v4/catalog/ListOfBooks`
      expect(status).toBe(200)
      expect(data.value?.length).toBe(2)
      const bookTitles = data.value.map(book => book.title)
      expect(bookTitles).toContain('Wuthering Heights')
      expect(bookTitles).toContain('Jane Eyre')
    })
  })

  describe('called by technicalUser (calling ReadCatalog API policy)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'technicalUser', password: '' }
    })

    /**
     * The ReadCatalog API policy grants access to books with stock < 30
     */
    it('/Books should return 2 Books (Eleonora, Catweazle)', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books`
      expect(status).toBe(200)
      expect(data.value?.length).toBe(3)
      expect(data.value).toContainEqual(expect.objectContaining({ title: 'Catweazle' }))
      expect(data.value).toContainEqual(expect.objectContaining({ title: 'Wuthering Heights' }))
      expect(data.value).toContainEqual(expect.objectContaining({ title: 'Jane Eyre' }))
    })

    // Book 252 = Eleonora
    it('/Books/252/getStockedValue() should be forbidden', async () => {
      expect.hasAssertions();
      return (GET`/odata/v4/catalog/Books/252/getStockedValue()`).catch(error => {
        expect(error.response.status).toBe(403)
      })
    })

    // Book 271 = Catweazle
    it('/Books/271/getStockedValue() should return 7770', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books/271/getStockedValue()`
      expect(status).toBe(200)
      expect(data.value).toBe(3300)
    })
  })

  describe('called by principalPropagation (cap.JuniorReader policy limited to ReadCatalog API policy)', () => {
    beforeAll(() => {
      axios.defaults.auth = { username: 'principalPropagation', password: '' }
    })

    /**
     * The JuniorReader policy adds attribute filters with an OR condition to the query:
     * - access to Catweazle is granted as its genre is Fantasy
     * - access to Eleonora is granted as its description hints at a happy ending but filtered out by stock < 30 from ReadCatalog policy
     */
    it('/Books should return 1 Book (Catweazle)', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books`
      expect(status).toBe(200)
      expect(data.value?.length).toBe(1)
      expect(data.value).toContainEqual(expect.objectContaining({ title: 'Catweazle' }))
    })

    // Book 252 = Eleonora
    it('/Books/252/getStockedValue() should be forbidden', async () => {
      expect.hasAssertions();
      return (GET`/odata/v4/catalog/Books/252/getStockedValue()`).catch(error => {
        expect(error.response.status).toBe(403)
      })
    })

    // Book 271 = Catweazle
    it('/Books/271/getStockedValue() should return 7770', async () => {
      const { status, data } = await GET`/odata/v4/catalog/Books/271/getStockedValue()`
      expect(status).toBe(200)
      expect(data.value).toBe(3300)
    })
  })

})
