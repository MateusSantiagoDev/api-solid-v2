import { Gyn } from '@prisma/client'

export interface GymsRepository {
  findById(id: string): Promise<Gyn | null>
}
