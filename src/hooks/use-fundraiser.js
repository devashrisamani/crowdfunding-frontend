import { useState, useEffect } from "react";

import getFundraiser from "../api/get-fundraiser";

export default function useFundraiser(fundraiserId) {
  const [fundraiser, setFundraiser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  const fetchFundraiser = () => {
    setIsLoading(true);
    setError(undefined);

    // Here we pass the fundraiserId to the getFundraiser function.
    getFundraiser(fundraiserId)
      .then((data) => {
        setFundraiser(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // This time we pass the fundraiserId to the dependency array so that the hook will re-run if the fundraiserId changes.
    if (fundraiserId) {
      fetchFundraiser();
    }
  }, [fundraiserId]);

  return { fundraiser, isLoading, error, refetch: fetchFundraiser };
}
