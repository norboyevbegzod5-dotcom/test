/**
 * Database schema and utilities
 */

import { Pool } from 'pg'

// Initialize connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

/**
 * Initialize database schema
 */
export async function initializeDatabase(): Promise<void> {
  const client = await pool.connect()
  try {
    // Projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        name VARCHAR(255) NOT NULL,
        cabinet_data JSONB NOT NULL,
        cutting_plan JSONB,
        hardware JSONB,
        cost JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Materials table (for pricing)
    await client.query(`
      CREATE TABLE IF NOT EXISTS materials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type VARCHAR(50) NOT NULL,
        thickness INTEGER NOT NULL,
        price_per_square_meter DECIMAL(10, 2) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Hardware prices table
    await client.query(`
      CREATE TABLE IF NOT EXISTS hardware_prices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type VARCHAR(50) UNIQUE NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id)
    `)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at)
    `)
  } finally {
    client.release()
  }
}

/**
 * Save project to database
 */
export async function saveProject(
  userId: string | null,
  name: string,
  cabinetData: any,
  cuttingPlan: any,
  hardware: any,
  cost: any
): Promise<string> {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `
      INSERT INTO projects (user_id, name, cabinet_data, cutting_plan, hardware, cost)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `,
      [userId, name, JSON.stringify(cabinetData), JSON.stringify(cuttingPlan), JSON.stringify(hardware), JSON.stringify(cost)]
    )
    return result.rows[0].id
  } finally {
    client.release()
  }
}

/**
 * Get project by ID
 */
export async function getProject(projectId: string, userId?: string) {
  const client = await pool.connect()
  try {
    const query = userId
      ? 'SELECT * FROM projects WHERE id = $1 AND user_id = $2'
      : 'SELECT * FROM projects WHERE id = $1'
    const params = userId ? [projectId, userId] : [projectId]
    const result = await client.query(query, params)
    return result.rows[0]
  } finally {
    client.release()
  }
}

/**
 * Get all projects for a user
 */
export async function getUserProjects(userId: string) {
  const client = await pool.connect()
  try {
    const result = await client.query(
      'SELECT id, name, created_at, updated_at FROM projects WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    )
    return result.rows
  } finally {
    client.release()
  }
}

/**
 * Update project
 */
export async function updateProject(
  projectId: string,
  userId: string,
  name: string,
  cabinetData: any,
  cuttingPlan: any,
  hardware: any,
  cost: any
): Promise<void> {
  const client = await pool.connect()
  try {
    await client.query(
      `
      UPDATE projects
      SET name = $1, cabinet_data = $2, cutting_plan = $3, hardware = $4, cost = $5, updated_at = NOW()
      WHERE id = $6 AND user_id = $7
    `,
      [name, JSON.stringify(cabinetData), JSON.stringify(cuttingPlan), JSON.stringify(hardware), JSON.stringify(cost), projectId, userId]
    )
  } finally {
    client.release()
  }
}

/**
 * Delete project
 */
export async function deleteProject(projectId: string, userId: string): Promise<void> {
  const client = await pool.connect()
  try {
    await client.query('DELETE FROM projects WHERE id = $1 AND user_id = $2', [
      projectId,
      userId,
    ])
  } finally {
    client.release()
  }
}

export { pool }
