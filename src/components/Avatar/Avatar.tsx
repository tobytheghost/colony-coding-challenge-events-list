import Blockies from 'react-blockies'
import styles from './Avatar.module.css'

interface AvatarProps {
  userAddress: string
}

const Avatar = ({ userAddress }: AvatarProps) => {
  return (
    <div className={styles['avatar']}>
      <Blockies seed={userAddress} scale={4}/>
    </div>
  )
}

export default Avatar
