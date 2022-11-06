import React, { useState, useEffect, useCallback } from "react";

interface Iconstructors {
  id: number,
  name: string,
} 


export const useFetchConstructors = (url: string) => {
    const [data, setData] = useState<Iconstructors[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>();

    const fetchConstructors = useCallback(async () => {
        setLoading(true);
        try{
            const response = await fetch(`${url}`, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
            });
            const json = await response.json();
            setData(json.data);
            setLoading(false);
          }catch(err){
            setError(err)
          }finally{
            setLoading(false)
          }
          setLoading(false);
    },[]);

    useEffect(() => {
        fetchConstructors().catch(console.error);
      }, [url]);

    return { data, error, loading };
}
