import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  // buscando o token no headers e validando ele
  await request.jwtVerify()

  // instanciando a factory de perfil
  const getUserProfile = makeGetUserProfileUseCase()

  // buscando o usuário pelo id que veio no headers
  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })

  // retorno p usuário sem o password
  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
