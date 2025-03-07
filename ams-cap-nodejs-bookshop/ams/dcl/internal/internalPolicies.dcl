INTERNAL Policy AMS_ValueHelp {
    USE cap.Reader;
}

INTERNAL Policy ReadCatalog {
    USE cap.Reader RESTRICT stock < 30, description IS NOT RESTRICTED, genre IS NOT RESTRICTED;
}