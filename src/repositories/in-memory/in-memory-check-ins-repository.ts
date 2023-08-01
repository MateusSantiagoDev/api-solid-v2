import { CheckIn, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'
import { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }
    this.items.push(checkIn)
    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    // representa os primeiros instantes do dia
    const startOfTheDay = dayjs(date).startOf('date')

    // representa os ultimos instantes do dia
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.items.find((checkIn) => {
      // estou verificando se a data de criação é depois do inicio
      // do dia e antes do fnal do dia
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20) //começa do zero e cada pagina tem 20
  }

  async countByUserId(userId: string): Promise<number> {
    return this.items.filter((item) => item.user_id === userId).length
  }
}
