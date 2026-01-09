import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('authentications', {
    id: {
      type: 'SERIAL',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    token: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.addConstraint('authentications', 'authentications_user_id_fkey', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

  pgm.addConstraint('authentications', 'authentications_user_id_key', {
    unique: ['user_id'],
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropConstraint('authentications', 'authentications_user_id_key');
  pgm.dropConstraint('authentications', 'authentications_user_id_fkey');
  pgm.dropTable('authentications');
}
