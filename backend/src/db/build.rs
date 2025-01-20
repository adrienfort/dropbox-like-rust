use sqlx::{postgres::PgPoolOptions, Pool, Postgres};
use std::{env, time::Duration};

pub async fn pg_pool() -> Pool<Postgres> {
    let db_url = env::var("DATABASE_URL").unwrap();
    let timeout = Duration::new(env::var("DB_TIMEOUT").unwrap().parse::<u64>().unwrap(), 0);
    let max_connections = env::var("DB_MAX_CONNECTIONS")
        .unwrap()
        .parse::<u32>()
        .unwrap();
    PgPoolOptions::new()
        .max_connections(max_connections)
        .acquire_timeout(timeout)
        .connect(&db_url)
        .await
        .unwrap()
}
