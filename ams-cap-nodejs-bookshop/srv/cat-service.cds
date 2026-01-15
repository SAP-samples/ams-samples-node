using { sap.capire.bookshop as my } from '../db/schema';

service CatalogService {

  /** For displaying lists of Books */
  @readonly entity ListOfBooks as projection on Books
  excluding { descr };

  /** For display in details pages */
  @restrict: [{ grant:['READ'], to: ['ReadBooks'], where: 'stock > 0' }]
  entity Books as projection on my.Books { *,
    author.name as author
  } excluding { createdBy, modifiedBy }
  actions {
    @restrict: [{ to: ['ReadBooks'] }]
    function getStockedValue(book: $self) returns Decimal;
    @restrict: [{ to: ['ReadBooks'] }]
    function getTotalStockedValue(books: many $self) returns Decimal;
  };

  @requires: 'authenticated-user'
  action submitOrder (
    book    : Books:ID @mandatory,
    quantity: Integer  @mandatory
  ) returns { stock: Integer };

  event OrderedBook : { book: Books:ID; quantity: Integer; buyer: String };
}
 