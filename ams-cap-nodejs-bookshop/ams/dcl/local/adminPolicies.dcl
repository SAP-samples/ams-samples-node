POLICY JuniorReader {
    USE cap.Reader RESTRICT description LIKE '%happy%ending%', genre IN ('Fantasy', 'Fairy Tale'),
                            stock IS NOT RESTRICTED;
}

POLICY BestsellerReader {
    USE cap.Reader RESTRICT stock < 20,
                            description IS NOT RESTRICTED, genre IS NOT RESTRICTED;
}

POLICY Zealot {
    USE cap.Inquisitor RESTRICT description LIKE '%religious%references%';
}