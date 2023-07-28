import { Prisma, User } from '@prisma/client'

export interface UsersRepository {

  findByEmail(email: string): Promise<User>

  create(data: Prisma.UserCreateInput): Promise<User>
  
}

