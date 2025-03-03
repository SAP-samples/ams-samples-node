POLICY "Reader" {
    ASSIGN ROLE "Reader" WHERE (description IS NOT RESTRICTED OR genre IS NOT RESTRICTED) AND stock IS NOT RESTRICTED;
}

POLICY Inquisitor {
    ASSIGN ROLE "Inquisitor" WHERE description IS NOT RESTRICTED;
}

POLICY "admin" {
    ASSIGN ROLE "admin";
}

