# Dropbox-like-rust

> You can find the subject [here](./Subject.md).

## Getting Started

### Installation

1. Make sure to have [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

### Quickstart

1. Setup the environment
```bash
cp .env.example .env
```
2. Run the project
```bash
docker compose up --build
```

### Usage

- To access the web application: http://localhost:3000
- To access the REST API: http://localhost:8080

## How does it work?

This dropbox-like project is divided in three components:
- PostgreSQL database
- Rust REST API
- React web application

> Check-out the [frontend documentation](./frontend/README.md) or the [backend documentation](./backend/README.md) for more information!