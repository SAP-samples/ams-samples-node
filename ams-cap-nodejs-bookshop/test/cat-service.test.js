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

  // describe('called by bob (cap.Reader policy assigned)', () => {
  //   beforeAll(() => {
  //     axios.defaults.auth = { username: 'bob', password: '' }
  //   })

  //   it('/Books should return all Books', async () => {
  //     const { status, data } = await GET`/odata/v4/catalog/Books`
  //     expect(status).toBe(200)
  //     expect(data.value?.length).toBe(5)
  //   })
  // })

  // describe('called by dave (cap.JuniorReader policy assigned)', () => {
  //   beforeAll(() => {
  //     axios.defaults.auth = { username: 'dave', password: '' }
  //   })

  //   /**
  //    * The JuniorReader policy adds an attribute filter based on genre.name to the query:
  //    * - access to Catweazle is granted as its genre name is Fantasy
  //    */
  //   it('/Books should return 1 Books (Catweazle)', async () => {
  //     const { status, data } = await GET`/odata/v4/catalog/Books`
  //     expect(status).toBe(200)
  //     expect(data.value?.length).toBe(1)
  //     expect(data.value).toContainEqual(expect.objectContaining({ title: 'Catweazle' }))
  //   })
  // })

  // describe('called by erin (BestsellerReader)', () => {
  //   beforeAll(() => {
  //     axios.defaults.auth = { username: 'erin', password: '' }
  //   })

  //   /**
  //    * The BestsellerReader policy adds an attribute filter based on stock to the query:
  //    * - access to Wuthering Heights and Jane Eyre is granted as their stock is < 20
  //    */
  //   it('/Books should return 2 Books (Wuthering Heights, Jane Eyre)', async () => {
  //     const { status, data } = await GET`/odata/v4/catalog/Books`
  //     expect(status).toBe(200)
  //     expect(data.value?.length).toBe(2)
  //     const bookTitles = data.value.map(book => book.title)
  //     expect(bookTitles).toContain('Wuthering Heights')
  //     expect(bookTitles).toContain('Jane Eyre')
  //   })
  // })

  // describe('called by fred (JuniorReader, BestsellerReader)', () => {
  //   beforeAll(() => {
  //     axios.defaults.auth = { username: 'fred', password: '' }
  //   })

  //   /**
  //    * Combination of two policies with different attribute filters should yield union of both result sets:
  //    * - via JuniorReader policy access to Catweazle is granted as it is a fantasy book
  //    * - via BestsellerReader policy access to Wuthering Heights and Jane Eyre is granted as they are low on stock
  //    */
  //   it('/Books should return 3 Books (Wuthering Heights, Jane Eyre, The Raven)', async () => {
  //     const { status, data } = await GET`/odata/v4/catalog/Books`
  //     expect(status).toBe(200)
  //     expect(data.value?.length).toBe(3)
  //     const bookTitles = data.value.map(book => book.title)
  //     expect(bookTitles).toContain('Wuthering Heights')
  //     expect(bookTitles).toContain('Jane Eyre')
  //     expect(bookTitles).toContain('Catweazle')
  //   })
  // })

})