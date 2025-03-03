using { sap.capire.bookshop as my } from '../db/schema';

service CatalogService {

  /** For displaying lists of Books */
  @ams.attributes: {
    description: null
  }
  @readonly entity ListOfBooks as projection on Books
  excluding { descr };

  /** For display in details pages */
  @restrict: [{ grant:['READ'], to: ['Reader', 'Inquisitor'], where: 'stock > 0' }]
  entity Books as projection on my.Books { *,
    author.name as author
  } excluding { createdBy, modifiedBy }
  actions {
    @restrict: [{ to: ['Reader'] }]
    function getStockedValue(book: $self) returns Decimal;
    @restrict: [{ to: ['Reader'] }]
    function getTotalStockedValue(books: many $self) returns Decimal;
  };

  @requires: 'authenticated-user'
  action submitOrder (
    book    : Books:ID @mandatory,
    quantity: Integer  @mandatory
  ) returns { stock: Integer };

  event OrderedBook : { book: Books:ID; quantity: Integer; buyer: String };
}
 