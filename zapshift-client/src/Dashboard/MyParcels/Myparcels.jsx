import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAuth from '../../Hooks/useAuth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

const Myparcels = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: parcels = [], refetch, isLoading } = useQuery({
    queryKey: ['user-parcels', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/myParcels?userEmail=${user.email}`);
      return res.data;
    },
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const formatParcelType = (type) => (type === 'document' ? 'Document' : 'Non-document');

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are You Sure?',
      text: 'This Parcel Will be permanently deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#6b7280',
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/dltparcels/${id}`).then((res) => {
          if (res.data.deletedCount) {
            refetch();
            Swal.fire({
              title: 'Deleted!',
              text: 'Your parcel request has been deleted.',
              icon: 'success',
            });
          }
        });
      }
    });
  };

  const handlePay = (id) => {
    navigate(`/dashboard/payment/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      {parcels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076503.png"
            alt="empty"
            className="w-28 mb-4 opacity-70"
          />
          <h2 className="text-xl font-semibold text-gray-700">No Parcels Available</h2>
          <p className="text-sm text-gray-500 mt-1">You haven't created any parcel yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parcels.map((parcel) => (
            <div
              key={parcel._id}
              className="bg-white rounded-2xl shadow-lg p-5 border hover:shadow-xl transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg text-gray-800">{formatParcelType(parcel.parcelType)}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    parcel.payment_status === 'paid'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {parcel.payment_status}
                </span>
              </div>

              {/* Body */}
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-800">Tracking ID:</span> {parcel.tracking_ID}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Parcel Name:</span> {parcel.parcelName}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Created:</span> {formatDate(parcel.creation_date)}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Cost:</span> €{parcel.cost}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Delivery:</span> {parcel.delivery_status}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-between gap-2 mt-5">
                <button className="flex-1 px-3 py-2 text-sm rounded-lg bg-lime-200 text-black hover:bg-lime-300 transition">
                  View
                </button>

                {parcel.payment_status === 'pending' && (
                  <button
                    onClick={() => handlePay(parcel._id)}
                    className="flex-1 px-3 py-2 text-sm rounded-lg bg-lime-400 text-black hover:bg-lime-500 transition"
                  >
                    Pay
                  </button>
                )}

                <button
                  onClick={() => handleDelete(parcel._id)}
                  className="flex-1 px-3 py-2 text-sm rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Myparcels;
