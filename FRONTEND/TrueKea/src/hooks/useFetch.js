import { useState, useEffect } from "react";
export default function useFetch(fn, params = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fn(...params).then(res => { setData(res); setLoading(false); });
  }, []);
  return { data, loading };
}
