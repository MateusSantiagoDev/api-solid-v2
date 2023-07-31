import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

export async function authenticate(request: FastifyRequest, replay: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const userRepository = new PrismaUserRepository()
    const sut = new AuthenticateUseCase(userRepository)
    await sut.execute({
      email,
      password,
    })
    return replay.status(200).send()
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return replay.status(400).send({ message: error.message })
    }
    // se o erro não foi conhecido trato ele em outra camada
    throw error
  }
}
