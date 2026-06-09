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
