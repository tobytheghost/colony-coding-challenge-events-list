import { Log } from 'ethers/providers'
import { BigNumberish, LogDescription } from 'ethers/utils'
import TOKENS from './tokens'

export type Token = keyof typeof TOKENS

export interface LogEvent {
  logTime: number | undefined
  userAddress: string | undefined
}

export interface DomainAddedEvent extends LogDescription, Log, LogEvent {
  name: string
  values: {
    domainId: BigNumberish
  }
}

export interface PayoutClaimedEvent extends LogDescription, Log, LogEvent {
  name: string
  values: {
    amount: BigNumberish
    fundingPotId: BigNumberish
    token: Token
  }
}

export interface ColonyInitialisedEvent extends LogDescription, Log, LogEvent {
  name: string
}

export interface ColonyRoleSetEvent extends LogDescription, Log, LogEvent {
  name: string
  role: any
  domainId: any
}

export type ParsedEvent =
  | DomainAddedEvent
  | PayoutClaimedEvent
  | ColonyInitialisedEvent
  | ColonyRoleSetEvent
