import { Gyn, Prisma } from '@prisma/client'

export interface findManyNearbyParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  findById(id: string): Promise<Gyn | null>
  create(data: Prisma.GynCreateInput): Promise<Gyn>
  searchMany(query: string, page: number): Promise<Gyn[]>
  findManyNearby(params: findManyNearbyParams): Promise<Gyn[]>
}
