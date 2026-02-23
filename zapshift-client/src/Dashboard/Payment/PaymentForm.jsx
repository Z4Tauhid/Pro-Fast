import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAuth from '../../Hooks/useAuth'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';


const PaymentForm = () => {


  const stripe = useStripe();
  const elements = useElements();
  const {parcelId} = useParams()
  const axiosSecure = useAxiosSecure()
  
  console.log(parcelId)
  const {user} = useAuth()
  const navigate = useNavigate()

  const [error, setError] = useState("")
  const [processing, setProcessing] = useState(false);

 //get/load data by using tanstack

 const {isPending, data: parcelInfo} = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async() => {
        const res = await axiosSecure.get(`/payParcels/${parcelId}`)
        return res.data
    }
 })

 if(isPending){
    return <p>Loading...</p>
 }
 
 const payAmount = parcelInfo.cost
 const amountInCents = payAmount*100
 console.log(amountInCents)

  const handleSubmit = async(e) =>{
    e.preventDefault()
    if(!stripe || !elements) return 

     setProcessing(true);

    const card = elements.getElement(CardElement)

    if(!card) return
    const {error, paymentMethod} = await stripe.createPaymentMethod({
        type: 'card',
        card

    })

    if (error) {
        setError(error.message)
    }
    else{
        setError('')
    }

    const res = await axiosSecure.post('/create-payment-intent', {
        amountInCents,
        parcelId
    })

    const clientSecret = res.data.clientSecret

    const result = await stripe.confirmCardPayment(clientSecret, {

        payment_method: {
            card: elements.getElement(CardElement),
                billing_details: {
                    name : user.displayName
                }
            
        }
    })

    if(result.error) {

         setError(result.error.message);
         setProcessing(false);

    } else {
        if(result.paymentIntent.status === 'succeeded'){
    const paymentInfo = {
      parcelId,
      email: user.email,
      amount: parcelInfo.cost,
      currency: result.paymentIntent.currency,
      transactionId: result.paymentIntent.id,
      paymentIntentId: result.paymentIntent.id,
      paymentMethod: result.paymentIntent.payment_method_types[0],
      paidAt: new Date().toISOString()
    };

     await axiosSecure.post('/payments', paymentInfo);

     Swal.fire({
      title: 'Payment Successful',
      text: 'Your parcel payment has been completed.',
      icon: 'success',
      confirmButtonText: 'Go to My Parcels'
    }).then(() => {
      navigate('/dashboard/myParcel');
    })

        }

        setProcessing(false);
    }
    console.log(res)

  }

    return (
        <div>
            <form onSubmit={handleSubmit} action="" className='space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto'>
                <CardElement className='p-2 border rounded'>
                    
                </CardElement>

                <button type="submit" className="btn bg-lime-400 w-full" disabled={!stripe || processing}>
                     {processing ? 'Processing...' : `Pay $${parcelInfo.cost}`}
                </button>
                {error && <p className="text-red-500">{error}</p>}

            </form>
        </div>
    );
};

export default PaymentForm;