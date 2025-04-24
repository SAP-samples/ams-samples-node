POLICY JuniorReader {
    USE cap.Reader RESTRICT genre IN ('Fantasy', 'Fairy Tale'), stock IS NOT RESTRICTED;
}

POLICY BestsellerReader {
    USE cap.Reader RESTRICT stock < 20, genre IS NOT RESTRICTED;
}