import {
  getColonyNetworkClient,
  Network,
  getBlockTime,
  getLogs
} from '@colony/colony-js'
import { EventFilter, utils, Wallet } from 'ethers'
import { InfuraProvider, Log } from 'ethers/providers'
import { BigNumberish, LogDescription } from 'ethers/utils'

interface Event {
  logTime: number | null
  userAddress: string
}

export interface DomainAddedEvent extends LogDescription, Log, Event {
  name: string
  values: {
    domainId: BigNumberish
  }
}

export interface PayoutClaimedEvent extends LogDescription, Log, Event {
  name: string
  values: {
    amount: BigNumberish
    fundingPotId: BigNumberish
    token: keyof typeof TOKENS
  }
}

export interface ColonyInitialisedEvent extends LogDescription, Log, Event {
  name: string
}

export type ParsedEvent = DomainAddedEvent | PayoutClaimedEvent | ColonyInitialisedEvent

export const TOKENS = {
	'0x0dd7b8f3d1fa88FAbAa8a04A0c7B52FC35D4312c': 'BLNY',
	'0x6B175474E89094C44Da98b954EedeAC495271d0F': 'DAI'
  }

const initColonyClient = async () => {
  const MAINNET_NETWORK_ADDRESS = `0x5346D0f80e2816FaD329F2c140c870ffc3c3E2Ef`
  const MAINNET_BETACOLONY_ADDRESS = `0x869814034d96544f3C62DE2aC22448ed79Ac8e70`
  const provider = new InfuraProvider()
  const wallet = Wallet.createRandom()
  const connectedWallet = wallet.connect(provider)
  const networkClient = await getColonyNetworkClient(
    Network.Mainnet,
    connectedWallet,
    {
      networkAddress: MAINNET_NETWORK_ADDRESS
    }
  )
  const colonyClient = await networkClient.getColonyClient(
    MAINNET_BETACOLONY_ADDRESS
  )

  const getColonyLogs = async () => {
	const getFilterLogs = async (filter: EventFilter) => {
	  return await getLogs(colonyClient, filter)
	}
  
	const { PayoutClaimed, DomainAdded, ColonyInitialised } = colonyClient.filters
  
	const eventPayoutLogs = await getFilterLogs(PayoutClaimed(null, null, null))
	const eventsDomainAddedLogs = await getFilterLogs(DomainAdded(null))
	// const eventsColonyRoleSetLogs = await getFilterLogs(ColonyRoleSet(null))
	const eventsColonyInitialisedLogs = await getFilterLogs(
	  ColonyInitialised(null, null)
	)
	const eventLogs = [
	  ...eventsColonyInitialisedLogs,
	  ...eventsDomainAddedLogs,
	  ...eventPayoutLogs
	]
	console.log(eventLogs)
  
	return { colonyClient, provider, eventLogs }
  }
  
  const parseColonyLog = async ({ event }: { event: Log }) => {
	const parsedEvent = colonyClient.interface.parseLog(event)
	const {
	  values: { fundingPotId }
	} = parsedEvent
	const fundingPot =
	  fundingPotId &&
	  (await colonyClient.getFundingPot(convertBigNumber(fundingPotId)))
	const payment =
	  fundingPot && (await colonyClient.getPayment(fundingPot.associatedTypeId))
	const userAddress = payment && payment.recipient
	const logTime = event.blockHash
	  ? await getBlockTime(provider, event.blockHash)
	  : null
	return {
	  ...event,
	  ...parsedEvent,
	  logTime,
	  userAddress
	}
  }

  return { colonyClient, provider, getColonyLogs, parseColonyLog }
}

export const wei = new utils.BigNumber(10);

export const convertBigNumber = (bigNumber: BigNumberish) => {
  return new utils.BigNumber(bigNumber)
}

export default initColonyClient
