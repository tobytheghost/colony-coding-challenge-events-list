import styles from './App.module.css'
import EventsList from './components/EventsList/EventsList'

const App = () => {
  return (
    <div className={styles['app']}>
      <EventsList />
    </div>
  )
}

export default App
