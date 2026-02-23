import Marquee from "react-fast-marquee";
const ClientsMarquee = () => {
  const logos = [
    { src: "/casio.png", alt: "Casio" },
    { src: "/amazon.png", alt: "Amazon" },
    { src: "/moonstar.png", alt: "Moonstar" },
    { src: "/star.png",alt: "Star+" },
    { src: "/start_people.png", alt: "Start People" },
    { src: "/randstad.png", alt: "Randstad" },
  ];

  return (
   <section className="bg-gray-100 py-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title */}
        <h3 className="text-center text-gray-700 font-semibold mb-8">
          We've helped thousands of sales teams
        </h3>

        {/* Marquee */}
        <Marquee
          direction="right"
          speed={100}
          pauseOnHover
          gradient={false}
          className="flex items-center"
        >
          {logos.map((logo, index) => (
            <img
              key={index}
              src={logo.src}
              alt={logo.alt}
              className="mx-10 h-6 object-contain opacity-80 hover:opacity-100 transition"
            />
          ))}
        </Marquee>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 mt-10"></div>
      </div>
    </section>
  );
};

export default ClientsMarquee;
