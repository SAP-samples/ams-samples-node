POLICY StockManager {
  ASSIGN ROLE ManageBooks WHERE Genre IS NOT RESTRICTED;
}

POLICY ContentManager {
  ASSIGN ROLE ManageAuthors;
  ASSIGN ROLE ManageBooks;
  ASSIGN ROLE ValueHelpUser;
}

POLICY Reader {
  ASSIGN ROLE ReadBooks WHERE Genre IS NOT RESTRICTED;
}

POLICY "ValueHelpUser" {
	ASSIGN ROLE "ValueHelpUser";
}