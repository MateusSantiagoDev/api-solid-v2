import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  // estou usando o CheckInUncheckedCreateInput
  // pois os dados que vou usar ja foram criados
  // que são o userId e gymId
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>

  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
}
