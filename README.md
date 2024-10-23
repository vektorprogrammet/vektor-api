# Vektorprogrammets API

Kildekoden er på engelsk

## Setup

Start med å kjøre `npm install` og pass på at du har fått installert alle avhengighetene riktig.
Deretter lag en `.env`-fil for å lage egne miljøvariabler
Start med å sette:
> PORT=***porten du vil kjøre apien fra*** *f.eks. 8080*
> HOSTING_URL=***urlen du kjører apiet fra*** *f.eks. localhost*

Deretter må du sette opp databasetilkoblingene.

---

### Med lokal database

Start med å sette opp et postgres bilde i docker.
Lag en database i bilet du satte opp.
Husk url(mest sannsynlig `localhost`), port, database navn, bruker(`postgres` om du ikke har spesifisert det) og passord.
Lokale databaser pleier ikke støtte SSL-tilkoblinger. Derfor må du nok sette opp denne instillingen i `.env`-filen:
> DATABASE_SSL_OPTION=**false**

### Med dev-database på digital ocean

Du finner tilkoblingsinnstillingene på digital ocean.
Siden databasen fortsatt er i utvilking og vi ikke har skaffet et CA-sertifikat til den enda, må du sette:
> DATABASE_SSL_OPTION=**dev**

Eventuelt **kan** du kopiere CA-serifikatet til databasen fra digital ocean og sette dette i en miljøvariabel, men dette er unødvendig under utvilking. Om du uansett vil prøve må du sette:
> DATABASE_SSL_OPTION=**prod-provide_ca_cert**
> CA_CERT=***CA-sertifikatet***

---

Nå legger du inn databaseinnstillingene som miljøvariabler:
> DATABASE_HOST=***din host*** *f.eks. localhost*
> DATABASE_PORT=***din port*** *f.eks. 5432*
> DATABASE_NAME=***ditt databasenavn*** *f.eks. vektorpostgres*
> DATABASE_USER=***din bruker*** *f.eks.postgres*
> DATABASE_PASSWORD=***ditt passord*** *pass123*

Eventuelt kan du sette:
>LOG_DATABASE_CREDENTIALS_ON_STARTUP=**true**

for å sjekke at tilkoblingsinstillingene til databasen ser bra ut når du kjører appen.

For å kjøre appen og migrere databasen, se scripts lenger nede.

## Recommended Extensions

### Imports Autocomplete

Name: npm Intellisense\
Id: christian-kohler.npm-intellisense\
Description: Visual Studio Code plugin that autocompletes npm modules in import statements\
Publisher: Christian Kohler\
VS Marketplace Link: <https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense>

### Formatting and Linting

Name: Biome\
Id: biomejs.biome\
Description: Toolchain of the web\
Publisher: biomejs\
VS Marketplace Link: <https://marketplace.visualstudio.com/items?itemName=biomejs.biome>

#### Configure format on save in VSCode

Paste the following into `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

### Pretty TypeScript Errors

Name: Pretty TypeScript Errors\
Id: YoavBls.pretty-ts-errors\
Description: Make TypeScript errors prettier and more human-readable in VSCode\
Publisher: yoavbls\
VS Marketplace Link: <https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors>

## Scripts

### Development

- `dev:once`
  - Run server
- `dev`
  - Run server w/restart on changes
- `test`
  - Run tests

### Linting and formatting

- `format`
  - Format files in `db` and `src`, safe fixes applied
- `lint`
  - Lint files in `db` and `src`, safe fixes applied
- `check`
  - Format and lint files in `db` and `src`, safe fixes applied

### Production

- `build`
  - Build server into /build
- `start`
  - Run the built server in /build

### Database

- `db:generate`
  - Generate migration files to /db/migrations
- `db:migrate`
  - Migrate the database with the generated migrationfiles in /db/migrations
- `db:studio`
  - Open the database in the drizzle studio interface

## Info

Tabellnavn er i *flertall* (users > user)

## TODO

Undersøk om vi kan implementere noen sikkerhetsprosedyrer fra: <https://helmetjs.github.io/faq/see-also/>
Implementer auth
Lag ordentlige database schemas
