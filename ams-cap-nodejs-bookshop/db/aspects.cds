using { sap.capire.bookshop.Genres } from './schema';

aspect stocked {
    stock: Integer;
}

aspect media {
    genre: Association to Genres;
}