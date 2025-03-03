using { stocked, media } from '../db/aspects';

annotate media with @ams.attributes: {
    genre: (genre.name)
};
annotate stocked with @ams.attributes: {
    stock: (stock)
};