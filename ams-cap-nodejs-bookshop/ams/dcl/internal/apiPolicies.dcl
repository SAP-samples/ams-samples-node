INTERNAL Policy AMS_ValueHelp {
    USE cap.admin;
}

INTERNAL Policy ReadCatalog {
    USE cap.Reader RESTRICT stock < 30, description IS NOT RESTRICTED, genre IS NOT RESTRICTED;
}