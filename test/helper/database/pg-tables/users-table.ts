import { Pool } from 'pg';

export interface UserData {
  id: string;
  username: string;
  password: string;
  fullname: string;
  created_at: Date;
}

function createHelper(pool: Pool) {
  return {
    add: async (data: UserData) => {
      const query = {
        text: 'INSERT INTO users VALUES ($1, $2, $3, $4, $5) RETURNING *',
        values: Object.values(data),
      };

      const result = await pool.query<UserData>(query);
      return result.rows[0];
    },

    findById: async (id: string) => {
      const query = {
        text: 'SELECT * FROM users WHERE id = $1',
        values: [id],
      };

      const result = await pool.query<UserData>(query);
      return result.rows;
    },

    cleanup: async () => {
      await pool.query('DELETE FROM users WHERE 1=1');
    },
  };
}

export default { createHelper };
