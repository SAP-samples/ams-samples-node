INTERNAL POLICY AMS_ValueHelp {
  ASSIGN ROLE ValueHelpUser;
}
INTERNAL POLICY ReadCatalog {
    USE cap.Reader RESTRICT Genre NOT IN ('Mystery', 'Romance', 'Thriller', 'Dystopia');
}