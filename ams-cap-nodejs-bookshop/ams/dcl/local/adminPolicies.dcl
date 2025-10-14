POLICY JuniorReader {
    USE cap.Reader RESTRICT 
        genre           IN ('Fantasy', 'Fairy Tale', 'Mystery'),
        description     IS NOT RESTRICTED,
        stock           IS NOT RESTRICTED;
}

POLICY BestsellerReader {
    USE cap.Reader RESTRICT 
        genre           IS NOT RESTRICTED,
        description     IS NOT RESTRICTED,
        stock           < 20;
}

POLICY Zealot {
    USE cap.Inquisitor RESTRICT 
        description     LIKE '%religious%references%';
}