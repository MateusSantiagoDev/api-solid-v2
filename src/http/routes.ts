import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { profile } from './controllers/profile'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)  
  app.post('/sessions', authenticate)

  // rotas que serão chamadas somente se o usuário estiver autenticado
  app.get('/me', profile)
}
