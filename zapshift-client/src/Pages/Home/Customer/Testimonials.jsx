import { useState } from "react";
import TopCustomer from "../../../../assets/customer-top.png";

const Testimonials = () => {
  const data = [
    {
      id: 1,
      name: "Awlad Hossain",
      role: "Senior Product Designer",
      text: "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine.",
      image: "https://i.ibb.co/w12kgb9/6451d77e317a772ff73a6d98ebc7a76b.jpg"
    },
    {
      id: 2,
      name: "Rasel Ahamed",
      role: "CTO",
      text: "Using this product daily helped me reduce back pain and improve posture significantly.",
      image: "https://i.ibb.co/9kLCqb0n/desktop-wallpaper-pc-call-of-duty-black-ops-2-awesome-bo2.jpg"
    },
    {
      id: 3,
      name: "Nasir Uddin",
      role: "CEO",
      text: "Simple, effective, and comfortable. I feel the difference within days.",
      image: "https://i.ibb.co/jnhSf4M/6d1a7036-1a21-4f06-96f9-a1076cb50c16.jpg"
    },
    {
      id: 4,
      name: "Sabbir Ahmed",
      role: "UX Designer",
      text: "Great for long working hours. Keeps my posture aligned effortlessly.",
      image: "https://i.ibb.co/HppyXwft/DSC-0025.jpg"
    },
    {
      id: 5,
      name: "Mehedi Hasan",
      role: "Frontend Developer",
      text: "Lightweight and easy to wear. Perfect for daily use.",
      image: "https://i.ibb.co/wNHgBBv7/DSC-0029.jpg"
    },
    {
      id: 6,
      name: "Fahim Rahman",
      role: "Backend Engineer",
      text: "Helps maintain posture without feeling restrictive.",
      image: "https://i.ibb.co/X6W7wqs/xavi.jpg"
    },
    {
      id: 7,
      name: "Tanvir Islam",
      role: "Product Manager",
      text: "Very useful for office work and long sitting hours.",
      image: "https://i.ibb.co/mF2ZmLbY/S5b1933c6c14047948a6c97b285c2ead30.jpg"
    },
    {
      id: 8,
      name: "Arafat Hossain",
      role: "Marketing Lead",
      text: "Improved my posture and reduced shoulder pain.",
      image: "https://i.ibb.co/5gXmQc9v/kambria-trout-Z3l-Axtohg7-U-unsplash.jpg"
    }
  ];

  const [current, setCurrent] = useState(0);
  const length = data.length;

  const prev = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  const next = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const leftIndex = (current - 1 + length) % length;
  const rightIndex = (current + 1) % length;

  const visibleCards = [
    data[leftIndex],
    data[current],
    data[rightIndex],
  ];

  return (
    <section className="bg-gray-100 py-20 mt-5">
      <div className="max-w-6xl mx-auto px-4 text-center flex flex-col items-center">

        <img src={TopCustomer} alt="" />

        <h2 className="text-3xl font-bold mb-3 mt-5">
          What our customers are saying
        </h2>

        <p className="text-gray-500 max-w-xl mx-auto mb-14">
          Enhance posture, mobility, and well-being effortlessly with Posture Pro.
        </p>

        <div className="flex items-center justify-center gap-6 w-11/12 mx-auto">
          {visibleCards.map((item, index) => {
            const isCenter = index === 1;

            return (
              <div
                key={item.id}
                className={`card w-96 bg-white shadow-lg transition-all duration-500
                  ${isCenter ? "opacity-100 scale-100" : "opacity-40 scale-95"}
                `}
              >
                <div className="card-body text-left">
                  <p className="text-gray-600 mb-6">
                    “{item.text}”
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img src={item.image} alt={item.name} />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-6 mt-10">
          <button onClick={prev} className="btn btn-circle btn-outline">❮</button>
          <button onClick={next} className="btn btn-circle bg-lime-400 border-none text-black hover:bg-lime-500">❯</button>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
