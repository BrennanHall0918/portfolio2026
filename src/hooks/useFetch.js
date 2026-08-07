import { useState, useEffect } from "react";

// Reusable custom hook for fetching data from any URL. Extracts the
// fetch/loading/error logic out of individual components so it's
// written once and works the same way everywhere it's used.
// This satisfies the assignment's "custom hook abstraction" requirment directly
export default function useFetch(url) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=> {
        // Guards against a race condition: if 'url' changes again (or this
        // component unmounts) while a fetch is still in flight, this flag
        // stops that old request's result from overwriting new state, or
        // from calling setState on an unmounted component. Set to true by
        // the cleanup function below, which React runs before this effect
        // re-fires or when the component using this hook unmounts.
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
        // Depending on [url] (not[]) is what makes this hook reusable
        // it refetches automatically if a component passes it a different
        // URL later, rather than only ever working for a single fixed
        // endpoint fetched once on mount.
    }, [url]);

    return { data, isLoading, error };
}