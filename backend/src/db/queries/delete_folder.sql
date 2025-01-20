DELETE FROM folders
WHERE
    id = $1 RETURNING *;