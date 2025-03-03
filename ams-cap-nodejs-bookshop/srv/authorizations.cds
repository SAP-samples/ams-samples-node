using { stocked, media } from './aspects';

annotate media with @ams.attributes: {
    description: (descr),
    genre: (genre.name)
};
annotate stocked with @ams.attributes: {
    stock: (stock)
};