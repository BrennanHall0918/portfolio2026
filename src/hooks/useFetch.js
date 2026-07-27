import { useState, useEffect } from "react";

export default function useFetch(url) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=> {
        let isCancelled = false;

        async function fetchData() {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Request failed: ${response.status}`);
                }

                const json = await response.json();
                if (!isCancelled) {
                    setData(json);
                }
            } catch (error) {
                if (!isCancelled) {
                    setError(error.message);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        fetchData();

        return () => {
            isCancelled = true;
        };
    }, [url]);

    return { data, isLoading, error };
}