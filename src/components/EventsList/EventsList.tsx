import { useEffect, useState } from 'react'
import getColonyLogs from '../../colony/getLogs'
import { ParsedEvent } from '../../colony/types'
import ListItem from '../ListItem/ListItem'
import styles from './EventsList.module.css'

const EventsList = () => {
  const [events, setEvents] = useState<ParsedEvent[]>([])

  useEffect(() => {
    let isCleanup = false

    const getEventLogs = async () => {
      const { eventLogs, parseColonyLog } = await getColonyLogs()
      eventLogs.forEach((event, i) => {
        // Slow down to prevent 429 errors
        setTimeout(async () => {
          if (isCleanup) return
          const parsedEvent = await parseColonyLog({ event })
          setEvents(events => [...events, parsedEvent])
        }, i * 50)
      })
    }
    setEvents([])
    getEventLogs()

    return () => {
      isCleanup = true
      setEvents([])
    }
  }, [])

  return (
    <div className={styles['events-list']}>
      {events
        .sort((a, b) => {
          return (b.logTime || 0) - (a.logTime || 0)
        })
        .map(event => {
          const { blockNumber, transactionIndex, logIndex, name } = event
          const eventKey = `${blockNumber}_${transactionIndex}_${logIndex}_${name}`
          return <ListItem key={eventKey} {...event} />
        })}
    </div>
  )
}

export default EventsList
