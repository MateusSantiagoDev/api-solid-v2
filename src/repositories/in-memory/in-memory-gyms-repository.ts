import { Gyn, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { GymsRepository, findManyNearbyParams } from '../gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordenates'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gyn[] = []

  async findById(id: string) {
    const gyn = this.items.find((item) => item.id === id)
    if (!gyn) {
      return null
    }
    return gyn
  }

  async create(data: Prisma.GynCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      created_at: new Date(),
    }
    this.items.push(gym)
    return gym
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20) //começa do zero e cada pagina tem 20
  }

  //latitude: item.latitude.toNumber(),
  //longitude: item.longitude.oNumber(),
  // os parâmetros que vem do prisma são passados
  // dessa forma pois são do formato DateTime e
  // precisão ser convertidos para number
  async findManyNearby(params: findManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        }
      )
      return distance < 10
    })
  }
}
