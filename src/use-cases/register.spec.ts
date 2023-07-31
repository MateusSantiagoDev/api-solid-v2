import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

describe('Register Use Case', () => {

  it('Should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password: '123123',
    })
    // espero que o id do usuário criado seja igual a qualquer string
    expect(user.id).toEqual(expect.any(String))
  })

  it('Should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password: '123123',
    })
    const isPasswordCorrectlyHashed = await compare(
      '123123',
      user.password_hash
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('Should not de able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'johnDoe@example.com'

    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '123123',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'John Doe',
        email,
        password: '123123',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

})
