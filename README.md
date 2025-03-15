# Vektorprogrammets API

Kildekoden er på engelsk

## Folder structure

- `/`
  - `db/` database modul
  - `lib/` generell delt kode
  - `src/` serverkode (CORE og API samlet)

## Setup

Start med å kjøre `npm install` og pass på at du har fått installert alle avhengighetene riktig.
Deretter lag en `.env`-fil for å lage egne miljøvariabler
Start med å sette:
> PORT=***porten du vil kjøre apien fra*** *f.eks. 8080*
>
> HOSTING_URL=***urlen du kjører apiet fra*** *f.eks. localhost*

Deretter må du sette opp databasetilkoblingene.

---

### Med lokal database

Start med å sette opp et postgres bilde i docker.
F.eks. med kommandoen `docker run --name vektorPostgres -p 5432:5432 -e POSTGRES_PASSWORD=pass123 -d postgres`
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
>
> CA_CERT=***CA-sertifikatet***

---

Nå legger du inn databaseinnstillingene som miljøvariabler:
> DATABASE_HOST=***din host*** *f.eks. localhost*
>
> DATABASE_PORT=***din port*** *f.eks. 5432*
>
> DATABASE_NAME=***ditt databasenavn*** *f.eks. vektorpostgres*
>
> DATABASE_USER=***din bruker*** *f.eks.postgres*
>
> DATABASE_PASSWORD=***ditt passord*** *pass123*

Eventuelt kan du sette:
>LOG_DATABASE_CREDENTIALS_ON_STARTUP=**true**

for å sjekke at tilkoblingsinstillingene til databasen ser bra ut når du kjører appen.

For å kjøre appen og migrere databasen, se scripts lenger nede.

## Recommended Extensions

### Imports Autocomplete

[`christian-kohler.npm-intellisense`](<https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense>)

### Formatting and Linting

[`biomejs.biome`](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)

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

[`YoavBls.pretty-ts-errors`](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)

## Scripts

### Development

- `pnpm dev:once`
Run server
- `pnpm dev`
Run server with restart on changes
- `pnpm test`
Run tests in `/src/tests`

### Linting and formatting

- `pnpm format`
Format files, safe fixes applied
- `pnpm lint`
Lint files in, safe fixes applied
- `pnpm check`
Format and lint files, safe fixes applied

### Production

- `pnpm build`
Build server into `/build`
- `pnpm start`
Run the built server in `/build`
- `pnpm prod`
Build, then start

### Database

- `docker compose up`
Start a postgres database in a docker container with the correct enviromentvariables
- `pnpm db:generate`
Generate migration files to `/db/migrations`
- `pnpm db:migrate`
Migrate the database with the generated migrationfiles in `/db/migrations`
- `pnpm db:studio`
Open the database in the drizzle studio interface
- `pnpm db:seed`
Seed the database with random, but deterministic values

## Info

Tabellnavn er i *flertall* (users > user)