using { sap.capire.bookshop as my }  from '../db/schema';

service AmsValueHelpService @(requires: 'admin') {
    @cds.localized: false
    entity Genres as projection on my.Genres;
}