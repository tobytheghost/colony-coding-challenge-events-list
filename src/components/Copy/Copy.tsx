import { convertBigNumber, wei } from '../../colony/helpers'
import TOKENS from '../../colony/tokens'
import {
  ColonyRoleSetEvent,
  DomainAddedEvent,
  ParsedEvent,
  PayoutClaimedEvent,
  Token
} from '../../colony/types'
import styles from './Copy.module.css'

const Copy = (event: ParsedEvent) => {
  const ListItemContent = () => {
    switch (event.name) {
      case 'DomainAdded': {
        return <DomainAddedContent {...(event as DomainAddedEvent)} />
      }
      case 'PayoutClaimed': {
        return <PayoutClaimedContent {...(event as PayoutClaimedEvent)} />
      }
      case 'ColonyRoleSet': {
        return <ColonySetContent {...(event as ColonyRoleSetEvent)} />
      }
      case 'ColonyInitialised':
        return <ColonyInitialisedContent />
      default:
        return null
    }
  }

  return (
    <div className={styles['copy']}>
      <div className={styles['primary']}>
        <ListItemContent />
      </div>
      <div className={styles['secondary']}>{getDateString(event)}</div>
    </div>
  )
}

const DomainAddedContent = ({ values }: DomainAddedEvent) => {
  const domainId = convertBigNumber(values.domainId)
  return (
    <>
      Domain <span className={styles['heavy']}>{`${domainId}`}</span> added.
    </>
  )
}

const PayoutClaimedContent = ({ values, userAddress }: PayoutClaimedEvent) => {
  const amount = convertBigNumber(values.amount).div(wei.pow(18))
  const fundingPotId = convertBigNumber(values.fundingPotId)
  const { token }: { token: Token } = values
  return (
    <>
      User <span className={styles['heavy']}>{`${userAddress}`}</span> claimed{' '}
      <span className={styles['heavy']}>
        {`${amount}`} {`${TOKENS[token] || ''}`}
      </span>{' '}
      payout from pot{' '}
      <span className={styles['heavy']}>{`${fundingPotId}`}</span>.
    </>
  )
}

const ColonySetContent = ({
  role,
  userAddress,
  domainId
}: ColonyRoleSetEvent) => {
  return (
    <>
      <span className={styles['heavy']}>{`${role}`}</span> role assigned to user{' '}
      <span className={styles['heavy']}>{`${userAddress}`}</span> in domain{' '}
      <span className={styles['heavy']}>{`${domainId}`}</span>.
    </>
  )
}

const ColonyInitialisedContent = () => {
  return <>Congratulations! It's a beautiful baby colony!</>
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

const getDateString = (event: ParsedEvent) => {
  const { logTime } = event
  const date = logTime && new Date(logTime)
  if (!date) return ''
  return `${('0' + date.getDate()).slice(-2)} ${MONTHS[date.getMonth()]}`
}

export default Copy
