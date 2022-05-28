import { ParsedEvent } from '../../colony/types'
import Avatar from '../Avatar/Avatar'
import Copy from '../Copy/Copy'
import styles from './ListItem.module.css'

const ListItem = (event: ParsedEvent) => {
  const { userAddress } = event
  console.log(event)
  return (
    <div className={styles['list-item']}>
      <Avatar userAddress={userAddress} />
      <Copy className={styles['list-item-copy']} event={event} />
    </div>
  )
}

export default ListItem
