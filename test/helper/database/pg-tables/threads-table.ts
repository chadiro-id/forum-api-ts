import { Pool } from 'pg';

export interface ThreadData {
  id: string;
  owner_id: string;
  title: string;
  body: string;
  created_at: Date;
}

function createHelper(pool: Pool) {
  return {
    add: async (data: ThreadData) => {
      const query = {
        text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING *',
        values: Object.values(data),
      };

      const result = await pool.query<ThreadData>(query);
      return result.rows[0];
    },

    findById: async (id: string) => {
      const query = {
        text: 'SELECT * FROM threads WHERE id = $1',
        values: [id],
      };

      const result = await pool.query<ThreadData>(query);
      return result.rows;
    },

    cleanup: async () => {
      await pool.query('DELETE FROM threads WHERE 1=1');
    },
  };
}

export default { createHelper };
