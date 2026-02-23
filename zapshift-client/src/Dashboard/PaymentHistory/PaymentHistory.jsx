import React from 'react';
import useAuth from '../../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isLoading, data: payments = [] } = useQuery({
    queryKey: ['payments', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Payment History</h2>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076503.png"
            alt="empty"
            className="w-28 mb-4 opacity-70"
          />
          <h2 className="text-xl font-semibold text-gray-700">No Payment History Available</h2>
          <p className="text-sm text-gray-500 mt-1">
            You have not made any payments yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="bg-white rounded-2xl shadow-lg p-5 border hover:shadow-xl transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg text-gray-800">Parcel Payment</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'paid'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {payment.status}
                </span>
              </div>

              {/* Body */}
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-800">Transaction ID:</span>{' '}
                  {payment.transactionId}
                </p>

                <p>
                  <span className="font-medium text-gray-800">Amount:</span> €{payment.amount}
                </p>

                <p>
                  <span className="font-medium text-gray-800">Method:</span> {payment.paymentMethod}
                </p>

                <p>
                  <span className="font-medium text-gray-800">Paid At:</span>{' '}
                  {new Date(payment.paidAt).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-between gap-2 mt-5">
                <button className="flex-1 px-3 py-2 text-sm rounded-lg bg-lime-200 text-black hover:bg-lime-300 transition">
                  View
                </button>

                <button
                  className="flex-1 px-3 py-2 text-sm rounded-lg bg-green-100 text-green-600 cursor-default"
                  disabled
                >
                  Paid
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
