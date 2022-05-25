import {
  DomainAddedEvent,
  PayoutClaimedEvent,
  convertBigNumber,
  ColonyInitialisedEvent,
  ParsedEvent,
  wei,
  TOKENS
} from '../../colonyClient'
import styles from './Copy.module.css'

const isDomainAdded = (event: ParsedEvent): event is DomainAddedEvent => {
  return (event as DomainAddedEvent).name === 'DomainAdded'
}

const isPayoutClaimed = (event: ParsedEvent): event is PayoutClaimedEvent => {
  return (event as PayoutClaimedEvent).name === 'PayoutClaimed'
}

const isColonyInitialisedEvent = (
  event: ParsedEvent
): event is ColonyInitialisedEvent => {
  return (event as ColonyInitialisedEvent).name === 'ColonyInitialised'
}

const getListItemContent = (event: ParsedEvent) => {
  if (isPayoutClaimed(event)) {
    const { values, userAddress } = event
    const amount = convertBigNumber(values.amount).div(wei.pow(18))
    const fundingPotId = convertBigNumber(values.fundingPotId)
    const { token }: { token: keyof typeof TOKENS } = values
    return `User ${userAddress} claimed ${amount} ${TOKENS[token] ||
      ''} payout from pot ${fundingPotId}.`
  }
  if (isDomainAdded(event)) {
    const { values } = event
    const domainId = convertBigNumber(values.domainId)
    return `Domain ${domainId} added.`
  }
  if (isColonyInitialisedEvent(event)) {
    return `Congratulations! It's a beautiful baby colony!`
  }
  return null
}

const getDate = (event: ParsedEvent) => {
  const { logTime } = event
  const date = logTime && new Date(logTime)
  if(!date) return ''
  return `${date.getDay()} ${date.getMonth()}`
}

const Copy = (event: ParsedEvent) => {
  return (
    <div className={styles['copy']}>
      <div className={styles['primary']}>{getListItemContent(event)}</div>
      <div className={styles['secondary']}>{getDate(event)}</div>
    </div>
  )
}

export default Copy
