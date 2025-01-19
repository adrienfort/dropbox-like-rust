mod api;
mod config;
mod db;

#[tokio::main]
async fn main() {
    config::env::setup();
    tracing_subscriber::fmt::init();

    let db = db::build::pg_pool().await;
    let app = api::router::build(db);
    let listener = api::listener::build().await;
    tracing::info!("API is listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}
