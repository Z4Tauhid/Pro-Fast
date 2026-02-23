import React, { use } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import Swal from 'sweetalert2';
import useAuth from "../Hooks/useAuth"
import useAxiosSecure from "../Hooks/useAxiosSecure";

const generateTrackingID = () => {
  const date = new Date();
  const datePart = date.toISOString().split("T")[0].replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  

  return `PCL-${datePart}-${rand}`;
};


const SendParcel = () => {
  const serviceCenters = useLoaderData();
  const navigate = useNavigate()

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      senderRegion: "",
      senderDistrict: "",
      receiverRegion: "",
      receiverDistrict: "",
      parcelType: "document",
    },
  });

  const {user} = useAuth()
  const axiosSecure = useAxiosSecure()

  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");

  // Unique regions
  const regions = [...new Set(serviceCenters.map((item) => item.region))];

  // Districts by region
  const getDistrictsByRegion = (region) => {
    return serviceCenters
      .filter((item) => item.region === region)
      .map((item) => item.district);
  };

  // Price calculator function

  const calculatePriceWithBreakdown = ({
  parcelType,
  weight,
  senderDistrict,
  receiverDistrict,
}) => {
  const isWithinCity = senderDistrict === receiverDistrict;
  const breakdown = [];
  let total = 0;

  // DOCUMENT
  if (parcelType === "document") {
    total = isWithinCity ? 60 : 80;
    breakdown.push(
      `Base Price (${isWithinCity ? "Within City" : "Outside City"}): ৳${total}`
    );
  }

  // NON-DOCUMENT
  if (parcelType === "non-document") {
    const basePrice = isWithinCity ? 110 : 150;
    total += basePrice;

    breakdown.push(
      `Base Price (Up to 3kg, ${isWithinCity ? "Within City" : "Outside City"}): ৳${basePrice}`
    );

    if (weight > 3) {
      const extraKg = Math.ceil(weight - 3);
      const extraWeightCharge = extraKg * 40;
      total += extraWeightCharge;

      breakdown.push(
        `Extra Weight: ${extraKg}kg × ৳40 = ৳${extraWeightCharge}`
      );

      if (!isWithinCity) {
        total += 40;
        breakdown.push("Outside City Extra Charge: ৳40");
      }
    }
  }

  return { total, breakdown };
};


  const handleSendParcel = (data) => {
    
    const { total, breakdown } = calculatePriceWithBreakdown({
    parcelType: data.parcelType,
    weight: Number(data.parcelWeight),
    senderDistrict: data.senderDistrict,
    receiverDistrict: data.receiverDistrict,
  });

  Swal.fire({
    title: "Agree with the Cost?",
    icon: "warning",
    html: `
      <div style="text-align:left">
        <p><strong>Pricing Breakdown:</strong></p>
        <ul style="padding-left:16px">
          ${breakdown.map(item => `<li>${item}</li>`).join("")}
        </ul>
        <hr/>
        <p style="font-size:16px"><strong>Total: ৳${total}</strong></p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Confirm and Continue My Parcels!",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#84cc16",
    cancelButtonColor: "#d33",
  }).then((result) => {
    if (result.isConfirmed) {
      console.log("Proceed to payment with:", total);
      navigate("/dashboard/myParcel")
      const parcelData = {
        ...data,
        createdBy: user.email,
        cost: total,
         delivery_status: 'Not_Collected',
         payment_status: 'unpaid',
        creation_date: new Date().toISOString(),
        tracking_ID: generateTrackingID ()
       

      }

      axiosSecure.post("/parcels", parcelData).then((res) => {
        console.log(res.data)
        if (res.data.insertedId) {
          // To Do : Redirect to a payment page
          Swal.fire({
            title: "Redirecting ...",
            text: "Proceeding To My Parcels ",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          })

        }
      })
    }
  });
  
  };

  return (
    <section className="w-11/12 mx-auto bg-white rounded-2xl shadow-xl p-6 mb-10 mt-15">
      <h2 className="text-xl font-semibold text-[#063b3b] mb-1">
        Add Parcel
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Enter your parcel details
      </p>

      <form onSubmit={handleSubmit(handleSendParcel)}>
        {/* Parcel Type */}
        <div className="flex gap-6 mb-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="document"
              {...register("parcelType")}
              className="accent-lime-500"
            />
            Document
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="non-document"
              {...register("parcelType")}
              className="accent-lime-500"
            />
            Non-Document
          </label>
        </div>

        {/* Parcel Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Parcel Name"
            className="input"
            {...register("parcelName", { required: true })}
          />
          <input
            type="number"
            placeholder="Parcel Weight (kg)"
            className="input"
            {...register("parcelWeight", { required: true })}
          />
        </div>

        {/* Sender & Receiver */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sender */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Sender Details</h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Sender Name*"
                className="input"
                {...register("senderName", { required: true })}
              />

              {/* Sender Region */}
              <select
                className="select"
                {...register("senderRegion", { required: true })}
              >
                <option value="" disabled>
                  Pick a region
                </option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>

              {/* Sender District */}
              <select
                className="select"
                {...register("senderDistrict", { required: true })}
                disabled={!senderRegion}
              >
                <option value="" disabled>
                  Pick a district
                </option>
                {senderRegion &&
                  getDistrictsByRegion(senderRegion).map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
              </select>

              <input
                type="text"
                placeholder="Address*"
                className="input"
                {...register("senderAddress", { required: true })}
              />

              <input
                type="email"
                placeholder="Sender Email*"
                className="input"
                {...register("senderEmail", { required: true })}
              />

              <textarea
                rows="3"
                placeholder="Pickup instruction*"
                className="input resize-none"
                {...register("pickUpInstruction", { required: true })}
              />
            </div>
          </div>

          {/* Receiver */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Receiver Details</h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Receiver Name*"
                className="input"
                {...register("receiverName", { required: true })}
              />

              {/* Receiver Region */}
              <select
                className="select"
                {...register("receiverRegion", { required: true })}
              >
                <option value="" disabled>
                  Pick a region
                </option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>

              {/* Receiver District */}
              <select
                className="select"
                {...register("receiverDistrict", { required: true })}
                disabled={!receiverRegion}
              >
                <option value="" disabled>
                  Pick a district
                </option>
                {receiverRegion &&
                  getDistrictsByRegion(receiverRegion).map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
              </select>

              <input
                type="text"
                placeholder="Address"
                className="input"
                {...register("receiverAddress")}
              />

              <input
                type="email"
                placeholder="Receiver Email*"
                className="input"
                {...register("receiverEmail", { required: true })}
              />

              <textarea
                rows="3"
                placeholder="Delivery instruction*"
                className="input resize-none"
                {...register("deliveryInstruction", { required: true })}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6">
          <p className="text-xs text-gray-500 mb-4">
            * Pickup Time 4pm–7pm Approx.
          </p>

          <button
            type="submit"
            className="bg-lime-400 hover:bg-lime-500 transition text-[#063b3b] text-sm font-semibold px-6 py-2 rounded-md"
          >
            Proceed to Confirm Booking
          </button>
        </div>
      </form>
    </section>
  );
};

export default SendParcel;
