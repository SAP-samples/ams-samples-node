INTERNAL Policy AMS_ValueHelp {
    USE cap.admin;
}

INTERNAL Policy ReadCatalog {
    USE cap.Reader RESTRICT 
        genre           IS NOT RESTRICTED,
        description     IS NOT RESTRICTED,
        stock           < 30;
}