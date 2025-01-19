use crate::db;
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, query_file_as, Pool, Postgres};
use std::collections::HashMap;
use uuid::Uuid;

#[derive(Serialize, FromRow)]
pub struct Folder {
    id: Uuid,
    name: String,
    parent_id: Option<Uuid>,
}

#[derive(Serialize, FromRow)]
struct OptionFolder {
    id: Option<Uuid>,
    name: Option<String>,
    parent_id: Option<Uuid>,
}

#[derive(Serialize)]
pub struct RecFolder {
    id: Uuid,
    name: String,
    parent_id: Option<Uuid>,
    sub_folders: Vec<RecFolder>,
}

#[derive(Deserialize)]
pub struct IdQuery {
    id: Option<Uuid>,
}

#[derive(Deserialize)]
pub struct PostFolderBody {
    name: String,
    parent_id: Option<Uuid>,
}

#[derive(Deserialize)]
pub struct PatchFolderBody {
    name: Option<String>,
}

pub async fn get_folder(
    State(pool): State<Pool<Postgres>>,
    Query(query): Query<IdQuery>,
) -> Result<(StatusCode, Json<Vec<RecFolder>>), (StatusCode, String)> {
    let call_db = match query.id {
        Some(id) => {
            query_file_as!(OptionFolder, "src/db/queries/get_folder.sql", id)
                .fetch_all(&pool)
                .await
        }
        None => {
            query_file_as!(OptionFolder, "src/db/queries/get_root_folder.sql")
                .fetch_all(&pool)
                .await
        }
    };

    let option_folders = match db::error::wrap(call_db) {
        Ok(value) => value,
        Err(err) => return Err(err),
    };

    if option_folders.len() == 0 {
        if let Some(id) = query.id {
            return Err((StatusCode::NOT_FOUND, format!("folder {id} not found")));
        } else if option_folders.len() == 0 {
            return Ok((StatusCode::OK, Json(vec![])))
        }
    }

    let rec_folders = match build_folder_hashmap_from_option_folder(&option_folders) {
        Ok(value) => build_rec_folders_from_folder_hashmap(option_folders[0].parent_id, &value),
        Err(err) => return Err(err),
    };

    Ok((StatusCode::OK, Json(rec_folders)))
}

pub async fn post_folder(
    State(pool): State<Pool<Postgres>>,
    Json(payload): Json<PostFolderBody>,
) -> Result<(StatusCode, Json<Folder>), (StatusCode, String)> {
    let call_db = query_file_as!(
        Folder,
        "src/db/queries/post_folder.sql",
        payload.name,
        payload.parent_id
    )
    .fetch_one(&pool)
    .await;

    let folder = match db::error::wrap(call_db) {
        Ok(value) => value,
        Err(err) => return Err(err),
    };

    Ok((StatusCode::CREATED, Json(folder)))
}

pub async fn patch_folder(
    State(pool): State<Pool<Postgres>>,
    Path(id): Path<Uuid>,
    Json(payload): Json<PatchFolderBody>,
) -> Result<(StatusCode, Json<Folder>), (StatusCode, String)> {
    let call_db = query_file_as!(Folder, "src/db/queries/patch_folder.sql", id, payload.name)
        .fetch_one(&pool)
        .await;

    let folder = match db::error::wrap(call_db) {
        Ok(value) => value,
        Err(err) => return Err(err),
    };

    Ok((StatusCode::OK, Json(folder)))
}

pub async fn delete_folder(
    State(pool): State<Pool<Postgres>>,
    Path(id): Path<Uuid>,
) -> Result<(StatusCode, Json<Folder>), (StatusCode, String)> {
    let call_db = query_file_as!(Folder, "src/db/queries/delete_folder.sql", id)
        .fetch_one(&pool)
        .await;

    let folder = match db::error::wrap(call_db) {
        Ok(value) => value,
        Err(err) => return Err(err),
    };

    Ok((StatusCode::OK, Json(folder)))
}

fn unwrap_option_folder(option_folder: &OptionFolder) -> Result<Folder, (StatusCode, String)> {
    let id = match option_folder.id {
        Some(value) => value,
        None => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("folder found has None id"),
            ))
        }
    };
    let name = match option_folder.name.as_ref() {
        Some(value) => value,
        None => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("folder found has None name"),
            ))
        }
    }
    .to_string();

    Ok(Folder {
        id,
        name,
        parent_id: option_folder.parent_id,
    })
}

fn build_folder_hashmap_from_option_folder(
    option_folders: &Vec<OptionFolder>,
) -> Result<HashMap<Option<Uuid>, Vec<Folder>>, (StatusCode, String)> {
    let mut folder_map: HashMap<Option<Uuid>, Vec<Folder>> = HashMap::new();
    for option_folder in option_folders {
        let folder = match unwrap_option_folder(option_folder) {
            Ok(value) => value,
            Err(err) => return Err(err),
        };
        folder_map
            .entry(folder.parent_id)
            .or_insert_with(Vec::new)
            .push(folder);
    }
    Ok(folder_map)
}

fn build_rec_folders_from_folder_hashmap(
    parent_id: Option<Uuid>,
    folder_hashmap: &HashMap<Option<Uuid>, Vec<Folder>>,
) -> Vec<RecFolder> {
    if let Some(folders) = folder_hashmap.get(&parent_id) {
        folders
            .iter()
            .map(|folder| RecFolder {
                id: folder.id,
                name: folder.name.clone(),
                parent_id: folder.parent_id,
                sub_folders: build_rec_folders_from_folder_hashmap(Some(folder.id), folder_hashmap),
            })
            .collect()
    } else {
        Vec::new()
    }
}
