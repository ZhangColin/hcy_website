// Prisma 7 configuration
import { defineConfig, env } from '@prisma/config'
import { config } from 'dotenv'

// Load .env file
config()

export default defineConfig({
  datasource: {
    url: env('DATABASE_URL'),
  },
})
