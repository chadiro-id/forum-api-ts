import { Pool } from 'pg';

export interface CommentLikeData {
  id: string;
  comment_id: string;
  user_id: string;
}

function createHelper(pool: Pool) {
  return {
    add: async (data: Omit<CommentLikeData, 'id'>) => {
      const query = {
        text: 'INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2) RETURNING *',
        values: [data.comment_id, data.user_id],
      };

      const result = await pool.query<CommentLikeData>(query);
      return result.rows[0];
    },
    findById: async (id: number) => {
      const query = {
        text: 'SELECT * FROM comment_likes WHERE id = $1',
        values: [id],
      };

      const result = await pool.query<CommentLikeData>(query);
      return result.rows;
    },
    cleanup: async () => {
      await pool.query('DELETE FROM comment_likes WHERE 1=1');
    },
  };
}

export default { createHelper };
