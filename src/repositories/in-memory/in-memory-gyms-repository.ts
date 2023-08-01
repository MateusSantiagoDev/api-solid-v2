import { Gyn } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gyn[] = []

  async findById(id: string) {
    const gyn = this.items.find((item) => item.id === id)
    if (!gyn) {
      return null
    }
    return gyn
  }
}
