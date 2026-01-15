using {sap.capire.bookshop as my} from '../db/schema';

service AdminService @(path: '/admin', requires: ['ManageAuthors', 'ManageBooks']) {

  @(restrict: [
    { grant: ['READ'], to: 'ManageAuthors' },
    { grant: ['READ', 'WRITE'], to: 'ManageBooks' } ])
  entity Books as projection on my.Books;

  @(restrict: [
    { grant: ['READ', 'WRITE'], to: 'ManageAuthors' },
    { grant: ['READ'], to: 'ManageBooks' } ])
  entity Authors as projection on my.Authors;
}