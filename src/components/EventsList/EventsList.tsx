import { useEffect, useState } from 'react'
import initColonyClient, { ParsedEvent } from '../../colonyClient'
import ListItem from '../ListItem/ListItem'
import styles from './EventsList.module.css'

const EventsList = () => {
  const [events, setEvents] = useState<ParsedEvent[]>([])

  useEffect(() => {
    let runCleanup = false

    const getEventLogs = async () => {
      const { getColonyLogs, parseColonyLog } = await initColonyClient()
      const { eventLogs } = await getColonyLogs()
      eventLogs.forEach((event, i) => {
        // Prevent 429 errors
        setTimeout(async () => {
          if (runCleanup) return
          const parsedEvent = await parseColonyLog({ event })
          setEvents(events => [...events, parsedEvent])
        }, i * 50)
      })
    }
    setEvents([])
    getEventLogs()

    return () => {
      runCleanup = true
    }
  }, [])

  return (
    <div className={styles['events-list']}>
      {events
        .sort((a, b) => {
          return (b.logTime || 0) - (a.logTime || 0)
        })
        .map(event => {
          const { name, transactionHash } = event
          return <ListItem key={`${transactionHash}_${name}`} {...event} />
        })}
    </div>
  )
}

export default EventsList
