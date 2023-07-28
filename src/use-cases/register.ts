import { UsersRepository } from '@/repositories/users-repository'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const useWithSameEmail = await this.usersRepository.findByEmail(email)

    if (useWithSameEmail) {
      throw new Error('E-mail already exists.')
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash: password,
    })
    
  }
}
