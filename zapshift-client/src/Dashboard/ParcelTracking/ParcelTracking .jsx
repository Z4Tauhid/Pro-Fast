import React, { useState } from "react";
import useParcelTracking from "../../Hooks/useParcelTracking";


const ParcelTracking = () => {
  const [trackingId, setTrackingId] = useState("");
  const [submittedId, setSubmittedId] = useState("");

  const { parcel, loading, error } = useParcelTracking(submittedId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trackingId) return;
    setSubmittedId(trackingId);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Parcel Tracking</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button className="btn bg-lime-400 hover:bg-lime-500" type="submit">
          Track
        </button>
      </form>

      {loading && <p>Loading parcel info...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {parcel && (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <p>
            <strong>Tracking ID:</strong> {parcel.tracking_ID || parcel._id}
          </p>
          <p>
            <strong>Current Status:</strong> {parcel.delivery_status}
          </p>
          <p>
            <strong>Assigned Rider:</strong>{" "}
            {parcel.assignedRider?.riderName || "Not Assigned"}
          </p>

          <h4 className="font-semibold mt-4">Tracking History</h4>
          <ul className="border-t pt-2">
            {parcel.trackingLogs?.length > 0 ? (
              parcel.trackingLogs
                .sort((a, b) => new Date(a.time) - new Date(b.time))
                .map((log, index) => (
                  <li key={index} className="py-1 border-b">
                    <p>
                      <strong>{log.status}</strong> - {log.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {log.updatedBy && `By: ${log.updatedBy}`} |{" "}
                      {new Date(log.time).toLocaleString()}
                    </p>
                  </li>
                ))
            ) : (
              <p>No tracking history yet.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ParcelTracking;
