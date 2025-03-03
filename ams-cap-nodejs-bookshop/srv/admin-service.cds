using { sap.capire.bookshop as my } from '../db/schema';
service AdminService @(requires:'admin', path: '/admin') {
  entity Books as projection on my.Books;
  @ams.attributes: {
    just: {
      for: {
        showcasing: {
          attributeNesting: (ID)
        }
      }
    }
  }
  entity Authors as projection on my.Authors;
}
