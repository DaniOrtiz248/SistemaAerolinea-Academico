import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

// Usar process.cwd() para obtener el directorio de trabajo actual
const cwd = process.cwd();

// Construir la ruta completa al archivo
const publicKeyPath = path.join(cwd, 'publicKey.pem')

// Leer el archivo
const publicKey = fs.readFileSync(publicKeyPath)

export const authMiddleware = (req, res, next) => {
    const token = req.cookies?.access_token
    if (!token) {
        return res.status(401).json({ error: 'No autorizado' })
    }

    try {
        
        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] })
        console.log('decoded:', decoded)
        req.user = decoded
        next()
    } catch (err) {
        console.error(err)
        res.status(401).json({ error: 'Token inválido' })
    }
}

export const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 2) { // Asumiendo que el rol 2 es el de administrador
        return res.status(403).json({ error: 'Acceso denegado' })
    }
    next()  
}

export const rootMiddleware = (req, res, next) => {
    if (req.user.role !== 1) { // Asumiendo que el rol 1 es el de root
        return res.status(403).json({ error: 'Acceso denegado' })
    }
    next()
}