using { sap.capire.bookshop.Genres } from '../db/schema';

aspect stocked {
    stock: Integer;
}

aspect media {
    genre: Association to Genres;
    descr: localized String(1111);
}