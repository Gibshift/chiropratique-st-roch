import type { Payload, PayloadRequest } from 'payload'

export const seed = async ({
  payload,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info(
    'Seed désactivé pour Chiropratique St-Roch. Aucune donnée démo Payload ne sera créée.',
  )
}