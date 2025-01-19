use std::env;
use tokio::net::TcpListener;

pub async fn build() -> TcpListener {
    TcpListener::bind(format!(
        "{}:{}",
        env::var("API_HOST").unwrap(),
        env::var("API_PORT").unwrap()
    ))
    .await
    .unwrap()
}
