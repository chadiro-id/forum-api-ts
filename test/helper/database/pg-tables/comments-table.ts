import { Pool } from 'pg';

export interface CommentData {
  id: string;
  thread_id: string;
  owner_id: string;
  content: string;
  is_delete: boolean;
  created_at: Date;
}

function createHelper(pool: Pool) {
  return {
    add: async (data: CommentData) => {
      const query = {
        text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        values: Object.values(data),
      };

      const result = await pool.query<CommentData>(query);
      return result.rows[0];
    },

    findById: async (id: string) => {
      const query = {
        text: 'SELECT * FROM comments WHERE id = $1',
        values: [id],
      };

      const result = await pool.query<CommentData>(query);
      return result.rows;
    },

    cleanup: async () => {
      await pool.query('DELETE FROM comments WHERE 1=1');
    },
  };
}

export default { createHelper };
