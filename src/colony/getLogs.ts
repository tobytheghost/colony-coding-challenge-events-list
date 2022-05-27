import { ColonyClient, getBlockTime, getLogs } from '@colony/colony-js'
import { EventFilter } from 'ethers'
import { Log } from 'ethers/providers'
import getClient, { provider } from './getClient'
import { convertBigNumber } from './helpers'

type ParseColonyLog = { event: Log }

const getFilterLogs = async (
  colonyClient: ColonyClient,
  filter: EventFilter
) => {
  return await getLogs(colonyClient, filter)
}

const getColonyLogs = async () => {
  const colonyClient = await getClient()

  const eventPayoutLogs = await getFilterLogs(
    colonyClient,
    colonyClient.filters.PayoutClaimed(null, null, null)
  )
  const eventsDomainAddedLogs = await getFilterLogs(
    colonyClient,
    colonyClient.filters.DomainAdded(null)
  )
  const eventsColonyRoleSetLogs = await getFilterLogs(
    colonyClient,
    colonyClient.filters.ColonyRoleSet(null, null, null, null)
  )
  const eventsColonyInitialisedLogs = await getFilterLogs(
    colonyClient,
    colonyClient.filters.ColonyInitialised(null, null)
  )

  const eventLogs = [
    ...eventPayoutLogs,
    ...eventsDomainAddedLogs,
    ...eventsColonyInitialisedLogs,
    ...eventsColonyRoleSetLogs
  ]

  const getUserAddress = async (fundingPotId: string | undefined) => {
    if (!fundingPotId) return
    const convertedPotId = convertBigNumber(fundingPotId)
    const fundingPot = await colonyClient.getFundingPot(convertedPotId)
    if (!fundingPot) return
    const payment = await colonyClient.getPayment(fundingPot.associatedTypeId)
    if (!payment) return
    return payment.recipient
  }

  const getLogTime = async (blockHash: string | undefined) => {
    if (!blockHash) return
    return await getBlockTime(provider, blockHash)
  }

  const parseColonyLog = async ({ event }: ParseColonyLog) => {
    const parsedEvent = colonyClient.interface.parseLog(event)
    const fundingPotId = parsedEvent.values.fundingPotId
    const userAddress = await getUserAddress(fundingPotId)
    const logTime = await getLogTime(event.blockHash)
    return {
      ...event,
      ...parsedEvent,
      logTime,
      userAddress
    }
  }

  console.log(eventLogs)

  return { parseColonyLog, eventLogs }
}

export default getColonyLogs
