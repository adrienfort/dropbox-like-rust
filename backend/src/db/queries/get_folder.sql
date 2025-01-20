WITH RECURSIVE
    folder_tree AS (
        SELECT
            id,
            name,
            parent_id,
            ARRAY[id] AS path
        FROM
            folders
        WHERE
            id = $1
        UNION ALL
        SELECT
            f.id,
            f.name,
            f.parent_id,
            ft.path || f.id
        FROM
            folders f,
            folder_tree ft
        WHERE
            f.parent_id = ft.id
            AND NOT f.id = ANY (ft.path)
    )
SELECT
    id,
    name,
    parent_id
FROM
    folder_tree;