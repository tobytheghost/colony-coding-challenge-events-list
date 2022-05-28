import { ColonyClient, getBlockTime, getLogs } from '@colony/colony-js'
import { EventFilter } from 'ethers'
import { Log } from 'ethers/providers'
import memoize from '../helpers/memoize'
import getClient, { MAINNET_NETWORK_ADDRESS, provider } from './getClient'
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
    ...eventsColonyInitialisedLogs,
    ...eventsColonyRoleSetLogs,
    ...eventsDomainAddedLogs,
    ...eventPayoutLogs
  ].reverse()

  const memoizedGetFundingPot = memoize(colonyClient.getFundingPot)
  const memoizedGetPayment = memoize(colonyClient.getPayment)

  const getUserAddress = async (fundingPotId: string | undefined) => {
    if (!fundingPotId) return
    const convertedPotId = convertBigNumber(fundingPotId)
    const fundingPot = await memoizedGetFundingPot(convertedPotId)
    if (!fundingPot) return
    const payment = await memoizedGetPayment(fundingPot.associatedTypeId)
    if (!payment) return
    return payment.recipient
  }

  const memoizedGetBlockTime = memoize(getBlockTime)

  const getLogTime = async (blockHash: string | undefined) => {
    if (!blockHash) return
    return await memoizedGetBlockTime(provider, blockHash)
  }

  const memoizedGetUserAddress = memoize(getUserAddress)
  const memoizedGetLogTime = memoize(getLogTime)

  const parseColonyLog = async ({ event }: ParseColonyLog) => {
    const parsedEvent = colonyClient.interface.parseLog(event)
    const fundingPotId = parsedEvent.values.fundingPotId
    const userAddress = parsedEvent.values.user || await memoizedGetUserAddress(fundingPotId)
    const logTime = await memoizedGetLogTime(event.blockHash)
    console.log(parsedEvent)
    return {
      ...event,
      ...parsedEvent,
      userAddress: userAddress ? userAddress : MAINNET_NETWORK_ADDRESS,
      logTime,
    }
  }

  console.log(eventLogs)

  return { parseColonyLog, eventLogs }
}

export default getColonyLogs
