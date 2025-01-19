use crate::api::handlers;
use axum::{
    routing::{delete, get, patch, post},
    Router,
};
use sqlx::{Pool, Postgres};
use tower_http::trace::TraceLayer;

pub fn build(db: Pool<Postgres>) -> Router {
    Router::new()
        .route("/health", get(handlers::health::health))
        .route("/folders", get(handlers::folders::get_folder))
        .route("/folders", post(handlers::folders::post_folder))
        .route("/folders/{id}", patch(handlers::folders::patch_folder))
        .route("/folders/{id}", delete(handlers::folders::delete_folder))
        .with_state(db)
        .layer(TraceLayer::new_for_http())
}
