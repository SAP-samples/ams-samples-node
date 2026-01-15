using { sap.capire.bookshop.Genres } from './schema';

aspect media {
    genre: Association to Genres;
    stock: Integer;
}