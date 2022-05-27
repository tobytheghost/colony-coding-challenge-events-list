import Blockies from 'react-blockies'
import styles from './Avatar.module.css'

interface AvatarProps {
  userAddress: string | undefined
}

const Avatar = ({ userAddress }: AvatarProps) => {
  const seed = userAddress ? userAddress : 'default'
  return (
    <div className={styles['avatar']}>
      <Blockies seed={seed} scale={4}/>
    </div>
  )
}

export default Avatar
