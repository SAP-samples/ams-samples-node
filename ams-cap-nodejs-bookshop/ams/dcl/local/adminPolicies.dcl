POLICY StockManagerFiction {
    USE cap.StockManager RESTRICT Genre IN ('Mystery', 'Fantasy');
}

POLICY JuniorReader {
    USE cap.Reader RESTRICT Genre IN ('Fairy Tale', 'Fantasy', 'Mystery');
}