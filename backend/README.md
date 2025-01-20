# Backend - Dropbox-like-rust

## Getting Started

### Installation

1. Make sure to have [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.
2. Make sure to have [rustup](https://doc.rust-lang.org/cargo/getting-started/installation.html) installed.
3. Install `sqlx-cli`
```bash
cargo install sqlx-cli
```

### Quickstart

1. Setup the environment
```bash
cp .env.example .env
```
2. Run the database
```bash
docker compose -f compose.dev.yaml up
```
3. Migrate the database
```bash
sqlx migrate run
```
4. Run the REST API
```bash
cargo run
```

### Usage

#### Create a folder

> Create a folder under a given parent folder.

_Endpoint_: POST http://localhost:8080/folders

_Body_:

```json
{
    "name": "my beautiful folder",
    "parent_id": "0a7ba259-552d-4f41-bfe8-6957e0825b2c" // Optional
}
```
> if you want to create a folder a the root, don't specify `parent_id` and just keep the `name`

_Response_:

201: Created - Folder created
```json
{
    "id": "ed467fac-ccb4-43ce-8b1a-c83c956127d6",
    "name": "my beautiful folder",
    "parent_id": "0a7ba259-552d-4f41-bfe8-6957e0825b2c"
}
```
> if the folder had been created at the root, `parent_id` would have been `null`

422: Unprocessable Entity - The body doesn't follow the right format
```
error message
```

500: Internal Server Error - Any other error
```
error message
```

#### Rename a folder

> Rename a folder with the specified ID.

_Endpoint_: PATCH http://localhost:8080/folders/{id}

_Body_:

```json
{
    "name": "my very beautiful folder",
}
```

_Response_:

200: OK - Folder renamed
```json
{
    "id": "ed467fac-ccb4-43ce-8b1a-c83c956127d6",
    "name": "my very beautiful folder", // new name
    "parent_id": "0a7ba259-552d-4f41-bfe8-6957e0825b2c"
}
```

404: Not found - the folder with specified ID not found
```
no rows returned by a query that expected to return at least one row
```

422: Unprocessable Entity - The body doesn't follow the right format
```
error message
```

500: Internal Server Error - Any other error
```
error message
```

#### Delete a folder

> Delete a folder and all its sub-folders.

_Endpoint_: DELETE http://localhost:8080/folders/{id}

_Response_:

200: OK - Folder deleted
```json
{
    "id": "ed467fac-ccb4-43ce-8b1a-c83c956127d6",
    "name": "my very beautiful folder",
    "parent_id": "0a7ba259-552d-4f41-bfe8-6957e0825b2c"
}
```

404: Not found - the folder with specified ID not found
```
no rows returned by a query that expected to return at least one row
```

500: Internal Server Error - Any other error
```
error message
```

#### List folders

> Get a folder structure starting from the given ID, including all sub-folders.

_Endpoint_:
- GET http://localhost:8080/folders
> To get the root folder structure
- GET http://localhost:8080/folders?id={id}
> To get the folder structure of with a given ID

_Response_:

200: OK - Folder found
```json
[
    {
        "id": "5a9eb376-626a-4977-b696-20c21cb2d4b5",
        "name": "i'm at the root level",
        "parent_id": null,
        "sub_folders": [
            {
                "id": "74fe9572-95b3-4a3d-8449-9053b6f26595",
                "name": "i'm not at the root level",
                "parent_id": "5a9eb376-626a-4977-b696-20c21cb2d4b5",
                "sub_folders": [
                    {
                        "id": "1fc70731-c327-4e48-8269-7f8ecab5f40f",
                        "name": "me neither!",
                        "parent_id": "74fe9572-95b3-4a3d-8449-9053b6f26595",
                        "sub_folders": []
                    }
                ]
            }
        ]
    },
        {
        "id": "22a4e28a-656c-4ff8-ba19-dfe870fe792e",
        "name": "i'm also at the root level",
        "parent_id": null,
        "sub_folders": []
    }
]
```
```json
[
    {
        "id": "74fe9572-95b3-4a3d-8449-9053b6f26595",
        "name": "i'm not at the root level",
        "parent_id": "5a9eb376-626a-4977-b696-20c21cb2d4b5",
        "sub_folders": [
            {
                "id": "1fc70731-c327-4e48-8269-7f8ecab5f40f",
                "name": "me neither!",
                "parent_id": "74fe9572-95b3-4a3d-8449-9053b6f26595",
                "sub_folders": []
            }
        ]
    }
]
```
> this endpoint always returns an array:
> - if root directory structure return (if no `id` given), the length of this array can be > 1
> - if any other directory structure return (if `id` given), the lenght of this array is 1

404: Not found - the folder with specified ID not found
```
folder 0a7ba259-552d-4f41-bfe8-6957e0825b2c not found
```

500: Internal Server Error - Any other error
```
error message
```

## How does it work?

### Database

Relational database PostgreSQL is used, here is the schema (check-out the [migration](./migrations/20250117210914_setup.up.sql)):
```sql
CREATE TABLE
    IF NOT EXISTS folders (
        id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        parent_id UUID REFERENCES folders ON DELETE CASCADE
    );
```

Folders are linked one into the other, this makes easy to delete a specific folder and all its subfolders.

To prevent a loop (`folder C` in `folder B`, `folder B` in `folder A` and `folder A` in `folder C`), the API only enable a user to create a folder inside a folder. However, In the case the API enable a user to move a folder inside another folder, this should be handled.

But it's still handled in the SQL queries to retrieve recursively the structure of a folder, see `AND NOT f.id = ANY (ft.path)` [here](./src/db/queries/get_root_folder.sql).

### API

Rust with axum and sqlx. sqlx is chosen to develop faster, but with a more complex database Diesel would have been used.

## Notes

### What can be improved

1. In the request `POST /folders`, the API returns `500: Internal Server Error` if the `parent_id` follows the right format but doesn't exists. It should be `404 - Not found`.
2. In the database, the `name` property of a `folder` has a constraint: `VARCHAR(50)`. When a folder is created / renamed with a too long name, the API should return an appropriate error. 
3. The environment variables are checked (their presence) (see [here](./src/config/env.rs)) but not their type. This should be checked.