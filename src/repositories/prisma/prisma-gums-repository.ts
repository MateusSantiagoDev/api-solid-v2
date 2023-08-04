import { Prisma, Gyn } from '@prisma/client'
import { GymsRepository, findManyNearbyParams } from '../gyms-repository'
import { prisma } from '@/lib/prisma'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gyn.findUnique({
      where: {
        id,
      },
    })
    return gym
  }

  async create(data: Prisma.GynCreateInput) {
    const gym = await prisma.gyn.create({
      data,
    })
    return gym
  }

  // retorna todas as academias em que o titulo xontenha o parâmetro
  // take: busca 20 registros
  // skip: 20 por pagina
  async searchMany(query: string, page: number) {
    const gyms = await prisma.gyn.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return gyms
  }

  // usando $queryRaw para filtrar as academias próximas
  // calculando a distância em kms da latitude e longitude dos parâmetros
  // para retornar as academias onde a distância seja menor ou igual a 10 km
  async findManyNearby({ latitude, longitude }: findManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gyn[]>`
    SELECT * FROM gyms
    WHERE (6371 * acos( cos( radians(${latitude})) * cos( radians( latitude )) * cos( radians( longitude ) - radians(${longitude})) * sin( radians( latitude )))) <= 10
    `
    return gyms
  }
}
