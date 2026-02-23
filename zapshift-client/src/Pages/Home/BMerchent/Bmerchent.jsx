import { NavLink } from "react-router";
import locationMap from "../../../../assets/location-merchant.png"

const Bmerchent = () => {
  return (
    
    <section className="bg-[url('assets/be-a-merchant-bg.png')]
    bg-no-repeat
    bg-top w-full bg-[#063b3b] rounded-2xl px-10 py-12  flex flex-col md:flex-row items-center justify-between overflow-hidden border">

        {/* <img src="../../../../assets/be-a-merchant-bg.png" alt="" /> */}
      
      {/* Left Content */}
      <div className="max-w-xl text-white">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          Merchant and Customer Satisfaction <br />
          is Our First Priority
        </h1>

        <p className="text-sm md:text-base text-gray-200 mb-8">
          We offer the lowest delivery charge with the highest value along with
          100% safety of your product. Pathao courier delivers your parcels in
          every corner of Bangladesh right on time.
        </p>

        <div className="flex flex-wrap gap-4">
          {/* Button 1 */}
          <NavLink to={"/sendParcel"}
            className="px-6 py-3 rounded-full font-medium text-[#063b3b]
                       bg-lime-400 transition-all duration-300
                       hover:bg-lime-500 hover:shadow-lg"
          >
            Become a Merchant
          </NavLink>

          {/* Button 2 */}
          <NavLink to={"/beARider"}
            className="px-6 py-3 rounded-full font-medium text-lime-400
                       border border-lime-400 transition-all duration-300
                       hover:bg-lime-400 hover:text-[#063b3b] hover:shadow-lg"
          >
            Earn with ZapShift Courier
          </NavLink>
        </div>
      </div>

      {/* Right Illustration */}
      <div className="mt-10 md:mt-0">
        <img
          src={locationMap}
          alt="Delivery illustration"
          className="max-w-sm w-full"
        />
      </div>
    </section>
  );
};

export default Bmerchent;
