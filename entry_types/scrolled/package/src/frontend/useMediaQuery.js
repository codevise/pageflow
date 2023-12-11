import {useState, useEffect} from 'react'

export default function useMediaQuery(query, {active} = {active: true}) {
  const [doesMatch, setDoesMatch] = useState(false)

  useEffect(() => {
    if (!active) {
      return;
    }

    const onUpdateMatch = ({matches}) => {
      setDoesMatch(matches)
    }

    const matcher = window.matchMedia(query)
    matcher.addEventListener('change', onUpdateMatch)

    onUpdateMatch(matcher)

    return () => {
      matcher.removeEventListener('change', onUpdateMatch)
    }
  }, [query, setDoesMatch, active])

  return active && doesMatch
}
