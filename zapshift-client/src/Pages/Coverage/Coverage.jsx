import React, { useState } from "react";
import "leaflet/dist/leaflet.css";
import Finmap from "./Finmap";
import { useLoaderData } from "react-router";



const Coverage = () => {

    const finlandWarehouses = useLoaderData()
    const [searchText, setSearchText] = useState("");
    const [flyToPosition, setFlyToPosition] = useState(null);

    const handleSearch =(e) =>{
      e.preventDefault()
      
      const match = finlandWarehouses.find((warehouse) =>warehouse.district.toLowerCase() === searchText.toLowerCase());
    console.log(match)
    if (match) {
      setFlyToPosition([match.latitude, match.longitude]);
    } else {
      alert("District not found");
    }

    }

  return (
    <section className="w-full mx-auto py-5 shadow-2xl px-7 mb-5 rounded-2xl">
      
      {/* Header */}
      <h2 className="text-2xl font-bold text-[#063b3b] mb-3">
        We are available in 64 districts
      </h2>

      {/* Search */}
        
          <form onSubmit={handleSearch} action="" className="flex flex-col md:flex-row gap-3 items-stretch max-w-md rounded-full md:rounded-full px-4 py-2 mb-3">

             <input
              type="text"
              placeholder="Search here"
              onChange={(e) => setSearchText(e.target.value)}
              className=" w-full md:flex-1 bg-transparent outline-none text-sm text-gray-600 p-5 border rounded-2xl shadow-2xl"/>

              <button type="submit"
                className="
                  w-full md:w-auto
                  bg-lime-400
                  px-6 py-2
                  rounded-full
                  text-sm
                  font-medium
                  text-[#063b3b]
                  hover:bg-lime-500
                  transition
                "
              >
                Search
              </button>

          </form>
 



      <hr className="border-gray-200 mb-3" />

      {/* Subheading */}
      <h3 className="text-lg font-semibold text-[#063b3b] mb-4">
        We deliver almost all over Finland
      </h3>

      {/* Map Section */}
      <div className="w-full h-80 rounded-xl overflow-hidden border relative z-0">
        <Finmap finlandWarehouses = {finlandWarehouses} flyToPosition={flyToPosition}></Finmap>
      </div>
    </section>
  );
};

export default Coverage;
