import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { appRoutes } from '@/http/routes'
import { ZodError } from 'zod'
import { env } from './env-config'

export const app = fastify()

// registrando módulo jwt 
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(appRoutes)

// fução global do fastify para tratamento de erros
app.setErrorHandler((error, request, replay) => {
  // se o erro vier da validação do zod
  if (error instanceof ZodError) {
    return replay.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  if(env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: here-me-should-log-to-an-external-tool-like-dataDog/NewRelic/Sentry
  }
  return replay.status(500).send({ message: 'Internal server error.' })
})
