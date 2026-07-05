# DocLens React FSD Template

Base template for creating new web projects with **React + TypeScript + Vite** following **Feature-Sliced Design (FSD)**.

## Description

This repository is meant to be the starting point for the team's frontend projects. It includes a base architecture, aliases, initial routing, shared components, infrastructure scaffolding with Terraform, and GitHub Actions workflows for Pull Request, CI, and CD.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- ESLint
- GitHub Actions
- Terraform (base scaffolding)
- Docker Compose
- floci local AWS emulator
- Local API Gateway
- Local Lambda

## Requirements

- Node.js 22 or higher
- npm 10 or higher
- Docker Desktop
- Docker Compose

## Getting Started

```bash
npm install
npm run dev
```

The application will be available in the local Vite development environment.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the development environment |
| `npm run build` | Builds the production bundle |
| `npm run lint` | Runs ESLint across the project |
| `npm run preview` | Serves the built app locally |

## Project Structure

```text
.github/
  workflows/              # active GitHub Actions workflows
infra/
  environments/
    dev/
    staging/
    production/
  modules/
src/
  app/                    # bootstrap, providers, routing, and global styles
  pages/                  # full pages
  widgets/                # large reusable UI blocks
  features/               # business use cases
  entities/               # domain entities
  shared/                 # UI, config, utilities, and cross-cutting pieces
  tools/
  floci/                  # local API Gateway and Lambda PoC tooling
```

> The `processes` layer is not included by default because in modern FSD it is usually reserved for truly complex global flows.

## Configured Aliases

- `@/*`
- `@app/*`
- `@pages/*`
- `@widgets/*`
- `@features/*`
- `@entities/*`
- `@shared/*`

## What This Template Includes

- Main layout with header and footer
- Base routing with home and 404 pages
- Initial shared components (`Button`, `Container`)
- Base setup ready to scale with FSD
- `infra/terraform` structure prepared for IaC
- GitHub Actions workflows for Pull Request, CI, and CD
- Local API Gateway PoC using floci
- Front-end health check against local API Gateway
- Front-end file upload flow against local API Gateway and Lambda

## GitHub Actions

Active workflows live under **`.github/workflows/`** because GitHub Actions only detects workflows from that path.

- `pull-request.yml`: validates pull request changes
- `ci.yml`: runs lint, build, and publishes the `dist` artifact
- `cd.yml`: manual deployment workflow prepared as a template

## Infrastructure

The **`infra/terraform/`** directory is prepared to separate:

- `environments/`: environment-specific configuration
- `modules/`: shared and reusable modules

## Local API Gateway PoC with floci

This template includes a local technical PoC that validates the communication between the React front-end and an API Gateway environment powered by **floci**.

The PoC validates two local flows:

```text
React front-end
  -> VITE_API_BASE_URL
  -> floci local API Gateway
  -> local Lambda
  -> GET /health
  -> 200 response
```

```text
React front-end
  -> file upload form
  -> VITE_API_BASE_URL
  -> floci local API Gateway
  -> local Lambda
  -> POST /upload-file
  -> 200 response
```

### Front-end route

The validation page is available at:

```text
/poc-api-check
```

The page is also linked from:

* the top navigation as `API PoC`
* the home page through the `Validar API Gateway` action

### Start the local API Gateway

Run the local floci environment and the helper container that creates the local API Gateway, routes and Lambda integration:

```bash
docker compose up --build floci floci-tools
```

When the setup finishes successfully, the terminal prints something similar to:

```text
API Gateway ready.

Base URL:
http://localhost:4566/execute-api/<api-id>/dev

Health endpoint:
http://localhost:4566/execute-api/<api-id>/dev/health

Upload endpoint:
http://localhost:4566/execute-api/<api-id>/dev/upload-file

Environment file written to:
/workspace/.env.local.floci
```

The generated API ID can change between executions, so the API URL should not be hardcoded in the source code.

### Configure the front-end environment

After floci generates `.env.local.floci`, copy it to `.env.local`:

```powershell
Copy-Item .env.local.floci .env.local -Force
```

The resulting `.env.local` should contain a value similar to:

```env
VITE_API_BASE_URL=http://localhost:4566/execute-api/<api-id>/dev
VITE_APP_ENV=local
```

If `VITE_APP_ENV` is missing, add it manually:

```powershell
Add-Content .env.local "VITE_APP_ENV=local"
```

> `.env.local` and `.env.local.floci` are local generated files and must not be committed.

### Run the front-end

In another terminal, start Vite:

```bash
npm run dev
```

Open:

```text
http://localhost:5173/poc-api-check
```

### Test the health endpoint from terminal

After running floci and copying `.env.local.floci` to `.env.local`, run:

```powershell
$baseUrl = (Get-Content .env.local | Where-Object { $_ -like "VITE_API_BASE_URL=*" }) -replace "VITE_API_BASE_URL=", ""

Invoke-RestMethod "$baseUrl/health"
```

Expected result:

```text
status      : ok
service     : ...
environment : local
timestamp   : ...
```

### Test the upload endpoint from terminal

Create a test file:

```powershell
"hello doclens" | Set-Content test-upload.txt
```

Upload it through the local API Gateway:

```powershell
$baseUrl = (Get-Content .env.local | Where-Object { $_ -like "VITE_API_BASE_URL=*" }) -replace "VITE_API_BASE_URL=", ""

curl.exe -i -X POST -F "file=@test-upload.txt" "$baseUrl/upload-file"
```

Expected result:

```text
HTTP/1.1 200
```

or a JSON response indicating that the upload request reached the Lambda successfully.

### Test from the browser

With floci running and the front-end started:

1. Open `http://localhost:5173/poc-api-check`
2. Click `Check API Gateway`
3. Confirm that the health response is displayed
4. Select a file in the upload card
5. Click `Upload file to Lambda`
6. Confirm that the upload response is displayed with a successful status

### floci services

The Docker Compose setup includes:

* `floci`: local AWS emulator
* `floci-tools`: helper container that creates the local API Gateway, routes and Lambda integration

The important local endpoints are generated by floci and written to:

```text
.env.local.floci
```

### Local-only files

The following files should remain local only and must not be committed:

```text
.env.local
.env.local.floci
test-upload.txt
dist/
node_modules/
tools/floci/lambda/upload-api/function.zip
```

### Future real AWS deployment

The current working PoC uses floci locally and does not require real AWS permissions to demonstrate the front-end to API Gateway to Lambda flow.

A future real AWS deployment can reuse the same front-end contract:

```env
VITE_API_BASE_URL=https://xxxxx.execute-api.eu-west-1.amazonaws.com/dev
```

The intended production-like flow remains:

```text
React + Vite
  -> API Gateway
  -> Lambda
  -> document processing services
```

## How to Reuse This Template

1. Update `src/shared/config` with the new project's brand, copy, and links.
2. Replace `pages/home` with the real landing page or homepage.
3. Add new `pages`, `widgets`, `features`, and `entities` based on the project domain.
4. Complete Terraform and the CD workflow with the real deployment target.

## Recommended README Convention for React Projects

There is no official React-specific `README.md` standard, but there is a widely used structure that works well for most frontend repositories:

1. Title and short description
2. Stack or core technologies
3. Prerequisites
4. Installation and startup
5. Available scripts
6. Project structure
7. Environment variables or configuration
8. CI/CD or deployment flow
9. Contribution guide, if needed

This README follows that approach so the template is easier to understand and reuse.

