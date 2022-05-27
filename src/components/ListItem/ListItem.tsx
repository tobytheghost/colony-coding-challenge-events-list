import { ParsedEvent } from '../../colony/types'
import Avatar from '../Avatar/Avatar'
import Copy from '../Copy/Copy'
import styles from './ListItem.module.css'

const ListItem = (event: ParsedEvent) => {
  const { userAddress } = event
  return (
    <div className={styles['list-item']}>
      <Avatar userAddress={userAddress} />
      <Copy {...event} />
    </div>
  )
}

export default ListItem
