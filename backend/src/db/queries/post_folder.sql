INSERT INTO
    folders (name, parent_id)
VALUES
    ($1, $2) RETURNING *;