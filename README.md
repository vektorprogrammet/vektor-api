# Vektorprogrammets nye nettside

Kildekoden er på engelsk

## Startup

Start med å sette opp en postgres database i docker
Lag en database der
Lag en .env fil med disse optionene:

>DATABASE_HOST=**din host** *f.eks. localhost*
DATABASE_PORT=**din port** *f.eks. 5432*
DATABASE_NAME=**ditt databasenavn** *f.eks. vektorpostgres*
DATABASE_USER=**din bruker** *f.eks.postgres*
DATABASE_PASSWORD=**ditt passord** *pass123*

## Info

Tabellnavn er i *flertall* (users > user)

## TODO

Undersøk om vi kan implementere noen sikkerhetsprosedyrer fra: <https://helmetjs.github.io/faq/see-also/>
Implementer auth
Lag ordentlige database schemas