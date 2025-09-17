import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:3000',
  'http://192.168.80.12:3000',
  'https://mydomain.com'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true) // allow requests with no origin (like mobile apps or curl requests)

    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }

    callback(new Error('Not allowed by CORS'))
  },
  methods: ['GET', 'POST', 'DELETE', 'PATCH']

})
