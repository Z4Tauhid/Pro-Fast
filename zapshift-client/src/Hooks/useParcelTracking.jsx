import { useState, useEffect } from "react";
import axios from "axios";

const useParcelTracking = (trackingId) => {
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!trackingId) return;

    const fetchParcel = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://zapshift-back.vercel.app/parcel/track/${trackingId}`   
        );
        setParcel(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParcel();
  }, [trackingId]);

  return { parcel, loading, error };
};

export default useParcelTracking;
