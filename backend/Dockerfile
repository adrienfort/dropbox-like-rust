# Builder image
FROM rust:latest AS builder

WORKDIR /app

COPY . .

ENV SQLX_OFFLINE=true

RUN cargo install sqlx-cli --no-default-features --features postgres
RUN cargo build --release

# Production image
FROM debian:latest AS app

WORKDIR /app

RUN rm -rf /var/lib/apt/lists/*
# RUN apt-get update && apt-get install -y curl

COPY --from=builder /app/migrations migrations
COPY --from=builder /app/target/release/dropbox-like-rust dropbox-like-rust
COPY --from=builder /usr/local/cargo/bin/sqlx /usr/local/bin/sqlx

CMD ["/bin/sh", "-c", "sqlx migrate run && ./dropbox-like-rust"]