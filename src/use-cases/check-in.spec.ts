import { expect, describe, it, beforeEach } from 'vitest'
import { CheckInUseCase } from './ckeck-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'


let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check-In Use Case', () => {

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)
  })

  it('Should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gynId: 'gyn-01',
      userId: 'user-01'
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

})
