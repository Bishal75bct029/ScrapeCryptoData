import dotenv from 'dotenv'

dotenv.config();

export const PORT = process.env.PORT || 8111
export const SECRET_KEY = 'ScrapeCrypto'
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''