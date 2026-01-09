import { Pool } from 'pg';

export interface ReplyData {
  id: string;
  comment_id: string;
  owner_id: string;
  content: string;
  is_delete: boolean;
  created_at: Date;
}

function createHelper(pool: Pool) {
  return {
    add: async (data: ReplyData) => {
      const query = {
        text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        values: Object.values(data),
      };

      const result = await pool.query<ReplyData>(query);
      return result.rows[0];
    },

    findById: async (id: string) => {
      const query = {
        text: 'SELECT * FROM replies WHERE id = $1',
        values: [id],
      };

      const result = await pool.query<ReplyData>(query);
      return result.rows;
    },

    cleanup: async () => {
      await pool.query('DELETE FROM replies WHERE 1=1');
    },
  };
}

export default { createHelper };
