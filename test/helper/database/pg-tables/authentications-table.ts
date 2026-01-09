import { Pool } from 'pg';

export interface AuthenticationData {
  id: string;
  user_id: string;
  token: string;
}

function createHelper(pool: Pool) {
  return {
    add: async (data: Omit<AuthenticationData, 'id'>) => {
      const query = {
        text: 'INSERT INTO authentications (user_id, token) VALUES ($1, $2) RETURNING *',
        values: [data.user_id, data.token],
      };

      const result = await pool.query<AuthenticationData>(query);
      return result.rows[0];
    },

    findById: async (id: number) => {
      const query = {
        text: 'SELECT * FROM authentications WHERE id = $1',
        values: [id],
      };

      const result = await pool.query<AuthenticationData>(query);
      return result.rows;
    },

    cleanup: async () => {
      await pool.query('DELETE FROM authentications WHERE 1=1');
    },
  };
}

export default { createHelper };
