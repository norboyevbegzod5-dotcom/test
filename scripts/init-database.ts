/**
 * Database initialization script
 * Run with: npx ts-node scripts/init-database.ts
 */

import { initializeDatabase } from '../lib/database'

async function main() {
  console.log('Initializing database...')
  try {
    await initializeDatabase()
    console.log('Database initialized successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Failed to initialize database:', error)
    process.exit(1)
  }
}

main()
