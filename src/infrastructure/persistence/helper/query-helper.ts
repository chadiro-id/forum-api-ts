export type TableName =
  | 'users'
  | 'authentications'
  | 'threads'
  | 'comments'
  | 'replies';

export class QueryHelper {
  static buildSelectQuery(
    tableName: TableName,
    fields: string[],
    criteria: object,
  ) {
    const selectClauses = fields.join(', ');
    const values: any[] = [];
    let placeholderIndex = 1;

    const whereClauses: string[] = [];
    for (const [k, v] of Object.entries(criteria)) {
      if (v === undefined) continue;
      whereClauses.push(`${k} = $${placeholderIndex++}`);
      values.push(v);
    }

    const sql = `
      SELECT ${selectClauses}
      FROM  ${tableName}
      WHERE ${whereClauses.join(' AND ')}
    `;

    return { sql, values };
  }

  static buildUpdateQuery(
    tableName: TableName,
    criteria: object,
    data: object,
  ) {
    const setClauses: string[] = [];
    const values: any[] = [];
    let placeholderIndex = 1;

    for (const [k, v] of Object.entries(data)) {
      if (v === undefined) continue;
      setClauses.push(`${k} = $${placeholderIndex++}`);
      values.push(v);
    }

    const whereClauses: string[] = [];
    for (const [k, v] of Object.entries(criteria)) {
      if (v === undefined) continue;
      whereClauses.push(`${k} = $${placeholderIndex++}`);
      values.push(v);
    }

    const sql = `
      UPDATE ${tableName}
      SET ${setClauses.join(', ')}
      WHERE ${whereClauses.join(' AND ')}
      RETURNING *
    `;

    return { sql, values };
  }
}
