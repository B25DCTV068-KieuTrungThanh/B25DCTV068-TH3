import { useEffect, useState } from 'react';

export default function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timerId = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timerId);
  }, []);
  return now;
}
