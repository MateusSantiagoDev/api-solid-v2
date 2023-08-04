import { FastifyRequest, FastifyReply } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  // buscando o token no headers e validando ele
  await request.jwtVerify()

  return reply.status(200).send()
}
