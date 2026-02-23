import React from "react";

const ServiceCard = ({service}) => {
  
    const{title, description, icon:Icon} = service
    
  
    return (
    <div
      className="
        card rounded-2xl shadow-md transition-all duration-300
        bg-white text-gray-800
        hover:bg-lime-300 hover:text-gray-900
        hover:shadow-xl
      "
    >
      <div className="card-body items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-base-200 flex items-center justify-center">
          <Icon className="text-3xl  text-[#063B3E]" />
        </div>

        <h3 className="card-title text-lg font-semibold">{title}</h3>

        <p className="text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
