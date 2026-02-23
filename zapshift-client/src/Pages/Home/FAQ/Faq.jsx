import { useState } from "react";

const faqs = [
  {
    question: "How does this posture corrector work?",
    answer:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
  },
  {
    question: "Is it suitable for all ages and body types?",
    answer:
      "Yes, the posture corrector is designed to be adjustable and suitable for most body types and age groups.",
  },
  {
    question: "Does it really help with back pain and posture improvement?",
    answer:
      "Consistent use can help improve posture and reduce back and shoulder pain caused by poor alignment.",
  },
  {
    question: "Does it have smart features like vibration alerts?",
    answer:
      "Some models include smart vibration alerts to remind you when your posture needs correction.",
  },
  {
    question: "How will I be notified when the product is back in stock?",
    answer:
      "You will receive an email or SMS notification once the product becomes available again.",
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-11/12 mx-auto py-16 text-center">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-[#063b3b] mb-2">
        Frequently Asked Question (FAQ)
      </h2>
      <p className="text-gray-500 max-w-2xl mx-auto mb-10">
        Enhance posture, mobility, and well-being effortlessly with Posture Pro.
        Achieve proper alignment, reduce pain, and strengthen your body with ease!
      </p>

      {/* FAQ Items */}
      <div className="space-y-4 text-left max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`rounded-xl border transition-all duration-300 ${
              activeIndex === index
                ? "border-teal-400 bg-teal-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <button
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
              className="w-full flex items-center justify-between px-6 py-4 font-medium text-[#063b3b]"
            >
              {faq.question}
              <span
                className={`transform transition-transform duration-300 ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
              >
                ⌄
              </span>
            </button>

            {activeIndex === index && (
              <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="mt-10 flex justify-center">
        <button className="flex items-center gap-2 bg-lime-400 text-[#063b3b] px-6 py-3 rounded-full font-medium hover:bg-lime-500 transition">
          See More FAQ’s
          <span className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full">
            ↗
          </span>
        </button>
      </div>
    </section>
  );
};

export default Faq;
