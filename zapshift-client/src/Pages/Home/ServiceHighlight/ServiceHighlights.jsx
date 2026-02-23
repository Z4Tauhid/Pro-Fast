import ParcelTrack from "../../../../assets/live-tracking.png"
import SafeDelivery from "../../../../assets/safe-delivery.png"
import callCenter from "../../../../assets/safe-delivery.png"

const ServiceHighlights = () => {
  
  
  const features = [
    {
      title: "Live Parcel Tracking",
      description:
        "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment’s journey and get instant status updates for complete peace of mind.",
      icon: ParcelTrack,
    },
    {
      title: "100% Safe Delivery",
      description:
        "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
      icon: SafeDelivery,
    },
    {
      title: "24/7 Call Center Support",
      description:
        "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
      icon: callCenter,
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6 space-y-6">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row items-start gap-6 border"
          >
            {/* Icon */}
            <div className="shrink-0">
              <img
                src={item.icon}
                alt={item.title}
                className="w-20 h-20 object-contain"
              />
            </div>

            {/* Content */}
            <div className="flex-1 border-l border-dashed border-gray-700 pl-5">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {item.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Vertical Divider (desktop only) */}
            {index !== features.length - 1 && (
              <div className="hidden md:block w-px bg-dashed bg-gray-300" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceHighlights;
