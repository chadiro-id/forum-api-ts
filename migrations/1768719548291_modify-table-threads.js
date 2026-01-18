/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.dropConstraint('comments', 'comments_thread_id_fkey');

  pgm.renameTable('threads', 'threads_old');

  pgm.dropConstraint('threads_old', 'threads_owner_id_fkey');
  pgm.dropConstraint('threads_old', 'threads_pkey');

  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    owner_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      default: pgm.func('CURRENT_TIMESTAMP'),
    }
  });

  pgm.sql(`INSERT INTO threads (id, owner_id, title, body, created_at)
    SELECT id, owner_id, title, body, created_at FROM threads_old`);

  pgm.addConstraint('comments', 'comments_thread_id_fkey', {
    foreignKeys: {
      columns: 'thread_id',
      references: 'threads(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  });

  pgm.dropTable('threads_old');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('comments', 'comments_thread_id_fkey');

  pgm.renameTable('threads', 'threads_old');

  pgm.dropConstraint('threads_old', 'threads_owner_id_fkey');
  pgm.dropConstraint('threads_old', 'threads_pkey');

  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    owner_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      default: pgm.func('CURRENT_TIMESTAMP'),
    }
  });

  pgm.sql(`INSERT INTO threads (id, title, body, owner_id, created_at)
    SELECT id, title, body, owner_id, created_at FROM threads_old`);

  pgm.addConstraint('comments', 'comments_thread_id_fkey', {
    foreignKeys: {
      columns: 'thread_id',
      references: 'threads(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  });

  pgm.dropTable('threads_old');
};
