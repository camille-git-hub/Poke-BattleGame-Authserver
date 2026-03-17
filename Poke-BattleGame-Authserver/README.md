# Poke-BattleGame-Authserver
Auth server for Pokemon!

Auth server:
 - only place that knows passwords and issues tokens.
 - register users
 - login users
 - access jwt shortlived
 - refresh jwt long-lived, stored in in db for revocation/rotation
 
Frontend:
 - allows to input password and send it over to Auth.

Backend:
 - Never handles auth.
 - verifies access tokens
 - userId for Crud

