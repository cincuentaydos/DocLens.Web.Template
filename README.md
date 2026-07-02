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

## Requirements

- Node.js 22 or higher
- npm 10 or higher

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
  terraform/
    environments/
      dev/
      staging/
      production/
    modules/              # reusable Terraform modules
src/
  app/                    # bootstrap, providers, routing, and global styles
  pages/                  # full pages
  widgets/                # large reusable UI blocks
  features/               # business use cases
  entities/               # domain entities
  shared/                 # UI, config, utilities, and cross-cutting pieces
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

## GitHub Actions

Active workflows live under **`.github/workflows/`** because GitHub Actions only detects workflows from that path.

- `pull-request.yml`: validates pull request changes
- `ci.yml`: runs lint, build, and publishes the `dist` artifact
- `cd.yml`: manual deployment workflow prepared as a template

## Infrastructure

The **`infra/terraform/`** directory is prepared to separate:

- `environments/`: environment-specific configuration
- `modules/`: shared and reusable modules

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

## API Gateway PoC

This template includes a technical PoC to validate the communication between the React front-end and an AWS API Gateway-compatible backend.

### Front-end route

The validation page is available at:

/poc-api-check

It validates this flow:

React front-end
  -> VITE_API_BASE_URL
  -> API Gateway
  -> GET /health
  -> UI status panel

### Environment variables

Create a local environment file based on .env.example:

cp .env.example .env.local

For local development or a temporary API Gateway endpoint:

VITE_API_BASE_URL=https://example.execute-api.eu-west-1.amazonaws.com
VITE_APP_ENV=dev

In Windows PowerShell:

Set-Content .env.local "VITE_API_BASE_URL=https://example.execute-api.eu-west-1.amazonaws.com
VITE_APP_ENV=dev"

### Run the front-end

npm install
npm run dev

Open:

http://localhost:5173/poc-api-check

### Build

npm run build

The production build is generated under:

dist/

### floci local AWS emulator

The repository includes a local PoC under:

tools/floci/

Start Floci and provision the Lambda + HTTP API Gateway:

docker compose up --build floci floci-tools

If port 4566 is already occupied, override it before starting:

$env:FLOCI_PORT=4567
docker compose up --build floci floci-tools

This flow creates:

- a local Lambda function backed by Floci
- a GET /health route
- a POST /upload-file route that simulates a document upload and returns HTTP 200
- a dev stage exposed through Floci's execute-api endpoint

The provisioning step also writes the generated front-end environment to:

.env.local.floci

Example upload request from PowerShell:

$payload = @{
  fileName = 'contrato.pdf'
  contentType = 'application/pdf'
  content = 'ZmFrZS1iYXNlNjQ='
} | ConvertTo-Json -Compress

Invoke-RestMethod `
  -Uri "http://localhost:<FLOCI_PORT>/execute-api/<API_ID>/dev/upload-file" `
  -Method Post `
  -ContentType 'application/json' `
  -Body $payload

The response body includes the simulated upload metadata and status 200.

### Future Terraform/CD integration

The repository currently includes an infrastructure scaffold under:

infra/

The intended deployment path for the front-end is:

React + Vite build
  -> dist/
  -> S3 static assets bucket
  -> CloudFront distribution
  -> API Gateway backend configured through VITE_API_BASE_URL

Terraform and CD will be completed once the final AWS deployment target, account permissions and environment strategy are confirmed.
