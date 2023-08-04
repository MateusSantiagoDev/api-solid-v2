import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId)
    // se não encontrar o checkin
    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    // o metodo diff vai retornar a diferença entre as duas datas
    // data atual e a data de criação do checkin (em minutos nesse caso)
    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes'
    )

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    // se encontrar atualiza o validated_at com a data atual
    checkIn.validated_at = new Date()

    //atualizo o checkin
    await this.checkInRepository.save(checkIn)
    return { checkIn }
  }
}
