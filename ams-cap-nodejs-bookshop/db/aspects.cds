using { sap.capire.bookshop.Genres } from '../db/schema';

aspect stocked {
    stock: Integer;
}

aspect media {
    genre: Association to Genres;
}