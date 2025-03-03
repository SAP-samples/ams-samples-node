POLICY "Reader" {
    ASSIGN ROLE "Reader" WHERE genre IS NOT RESTRICTED AND stock IS NOT RESTRICTED;
}

POLICY "admin" {
    ASSIGN ROLE "admin";
}

