CREATE TABLE IF NOT EXISTS loaded_files (
    id INTEGER PRIMARY KEY,
    checksum TEXT,
    added_in INTEGER,
    last_save INTEGER,
    file_path TEXT
);

CREATE TABLE IF NOT EXISTS items (
    id INTEGER,
    file_id INTEGER,
    attributes TEXT,    -- JSON
    group_count INTEGER,
    size_width INTEGER,
    size_height INTEGER,
    real_size INTEGER,
    layers INTEGER,
    pattern_y INTEGER,
    pattern_x INTEGER,
    pattern_z INTEGER,
    group_animation_phases INTEGER,
    animation TEXT,     -- JSON
    sprites_index TEXT, -- JSON
    PRIMARY KEY (id, file_id),
    FOREIGN KEY (file_id) REFERENCES loaded_files(id)
);