import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { RegisterUseCase } from '@/use-cases/register'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'

export async function register(request: FastifyRequest, replay: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const userRepository = new PrismaUserRepository()
    const registerUseCase = new RegisterUseCase(userRepository)
    await registerUseCase.execute({
      name,
      email,
      password,
    })
    return replay.status(201).send()
  } catch (error) {
    return replay.status(409).send()
  }
}
