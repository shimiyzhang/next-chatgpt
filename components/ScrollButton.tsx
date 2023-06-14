import { useEffect, useState } from 'react'
import { DownArrow } from './Icons'

export function ScrollToButtom() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement
      const isBottom = scrollTop + clientHeight >= scrollHeight
      if (isBottom) setShow(false)
      else setShow(true)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    })
  }

  if (!show) return null

  return (
    <button
      className="fixed bottom-20 right-6 z-10 cursor-pointer rounded-full border border-gray-200 bg-gray-50 text-gray-600 dark:border-white/10 dark:bg-white/10 dark:text-gray-200 md:bottom-[120px]"
      onClick={scrollToBottom}
    >
      <DownArrow className="m-1 h-4 w-4" />
    </button>
  )
}
