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

    // Allow all localhost and local network IPs for development
    if (origin) {
      const url = new URL(origin);
      const hostname = url.hostname;
      
      // Allow localhost, 127.0.0.1, and local network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
      if (hostname === 'localhost' || 
          hostname === '127.0.0.1' ||
          hostname.startsWith('192.168.') ||
          hostname.startsWith('10.') ||
          (hostname.startsWith('172.') && hostname.split('.')[1] >= 16 && hostname.split('.')[1] <= 31) ||
          acceptedOrigins.includes(origin)) {
        return callback(null, true);
      }
    }

    callback(new Error('Not allowed by CORS'))
  },
  methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'OPTIONS']

})
