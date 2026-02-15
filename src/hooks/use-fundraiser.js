import { useState, useEffect } from "react";

import getFundraiser from "../api/get-fundraiser";

// Fetches a single fundraiser by id; refetch when id changes.
export default function useFundraiser(fundraiserId) {
  const [fundraiser, setFundraiser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  const fetchFundraiser = () => {
    setIsLoading(true);
    setError(undefined);

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
    if (fundraiserId) {
      fetchFundraiser();
    }
  }, [fundraiserId]); // Refetch when navigating to a different fundraiser.

  return { fundraiser, isLoading, error, refetch: fetchFundraiser };
}
