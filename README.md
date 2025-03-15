# Vektorprogrammets API

Kildekoden er på engelsk.

## Innholdsfortegnelse

- [Vektorprogrammets API](#vektorprogrammets-api)
  - [Innholdsfortegnelse](#innholdsfortegnelse)
  - [Mappestruktur](#mappestruktur)
  - [Oppsett](#oppsett)
    - [Med lokal database](#med-lokal-database)
    - [Med dev-database på digital ocean](#med-dev-database-på-digital-ocean)
  - [Recommended Extensions](#recommended-extensions)
    - [Imports Autocomplete](#imports-autocomplete)
    - [Formatting and Linting](#formatting-and-linting)
      - [Configure format on save in VSCode](#configure-format-on-save-in-vscode)
    - [Pretty TypeScript Errors](#pretty-typescript-errors)
  - [Scripts](#scripts)
    - [Development](#development)
    - [Linting and formatting](#linting-and-formatting)
    - [Production](#production)
    - [Database](#database)
  - [Info](#info)

## Mappestruktur

- `/`
  - `db/` database modul
  - `lib/` generell delt kode
  - `src/` serverkode (CORE og API samlet)

## Oppsett

Start med å kjøre

```sh
pnpm install
```

og pass på at du har fått installert alle avhengighetene riktig.
Deretter lag en `.env`-fil for å lage egne miljøvariabler
Start med å sette:

```.env
PORT=*porten du vil kjøre apien fra, f.eks. 8080*

HOSTING_URL=*urlen du kjører apiet fra, f.eks. localhost*
```

Deretter må du sette opp databasetilkoblingene.

Nå legger du inn databasetilkoblingsinnstillingene som miljøvariabler, anbefaler å bruke en `.env` fil. Du må legge inn alle disse innstillingene:

```.env
DATABASE_HOST= *f.eks. localhost*
DATABASE_PORT= *f.eks. 5432*
DATABASE_NAME= *f.eks. vektorpostgres*
DATABASE_USER= *f.eks. postgres*
DATABASE_PASSWORD= *f.eks. pass123*
```

Eventuelt kan du sette:

```.env
LOG_DATABASE_CREDENTIALS_ON_STARTUP=true
```

for å sjekke at tilkoblingsinstillingene til databasen ser bra ut når du kjører appen.

### Med lokal database

Kjør:

[`docker compose up` scriptet](#database)

og databasen burde være oppe og gå med en gang.
I `.env` sett

```.env
DATABASE_SSL_OPTION=false
```

fordi lokale databaser ikke tillater ssl-tilkoblinger.

### Med dev-database på digital ocean

Du finner tilkoblingsinnstillingene på digital ocean.
Siden databasen fortsatt er i utvilking og vi ikke har skaffet et CA-sertifikat til den enda, må du sette:

```.env
DATABASE_SSL_OPTION=dev
```

Eventuelt **kan** du kopiere CA-serifikatet til databasen fra digital ocean og sette dette i en miljøvariabel, men dette er unødvendig under utvilking. Om du uansett vil prøve må du sette:

```.env
DATABASE_SSL_OPTION=prod-provide_ca_cert
```

og

```.env
CA_CERT=*CA-sertifikatet*
```

i `.env`.

For å kjøre appen og migrere databasen, se [scripts](#database).

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

Run server

```sh
pnpm dev:once
```

Run server, watch for changes:

```sh
pnpm dev
```

Run tests in `/src/tests`:

```sh
pnpm test
```

### Linting and formatting

Format files, safe fixes applied:

```sh
pnpm format
```

Lint files in, safe fixes applied:

```sh
pnpm lint
```

Format and lint files, safe fixes applied:

```sh
pnpm check
```

### Production

Build into `/build`:

```sh
pnpm build
```

Run the built javascript in `/build`:

```sh
pnpm start
```

Build, then start:

```sh
pnpm prod
```

### Database

Start a postgres database in a docker container:

```sh
docker compose up
```

Generate migration files to `/db/migrations`:

```sh
pnpm db:generate
```

Migrate the database with the generated migrationfiles in `/db/migrations`:

```sh
pnpm db:migrate
```

Open the database in the drizzle studio interface:

```sh
pnpm db:studio
```

Seed the database with random, but deterministic values:

```sh
pnpm db:seed
```

## Info

Tabellnavn er i *flertall* (users > user)
