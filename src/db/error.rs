use axum::http::StatusCode;
use sqlx::{error::ErrorKind, Error};

pub fn wrap<T>(res: Result<T, Error>) -> Result<T, (StatusCode, String)> {
    match res {
        Ok(value) => Ok(value),
        Err(err) => match err {
            Error::RowNotFound => Err((StatusCode::NOT_FOUND, err.to_string())),
            Error::Database(db_err) => match db_err.kind() {
                ErrorKind::UniqueViolation => {
                    Err((StatusCode::CONFLICT, db_err.message().to_string()))
                }
                ErrorKind::CheckViolation => {
                    Err((StatusCode::BAD_REQUEST, db_err.message().to_string()))
                }
                // More errors: https://docs.rs/sqlx/latest/sqlx/error/enum.ErrorKind.html
                _ => Err((
                    StatusCode::INTERNAL_SERVER_ERROR,
                    db_err.message().to_string(),
                )),
            },
            // More errors: https://docs.rs/sqlx/latest/sqlx/enum.Error.html
            _ => Err((StatusCode::INTERNAL_SERVER_ERROR, err.to_string())),
        },
    }
}
