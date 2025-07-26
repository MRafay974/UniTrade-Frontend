import React from "react";
import { motion } from "framer-motion";

const PromoCard = () => {
  return (
    <div className="w-full sm:w-[400px] md:w-[270px] md:h-[600px] h-80 bg-[#ebebeb] rounded-2xl p-6 shadow-xl flex flex-col justify-between text-[#1F1F1F] animate-fade-in">
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
        className="text-3xl font-bold text-blue-600"
      >
        🔥 Big Sale!
      </motion.div>

      <div className="text-lg font-semibold mt-4">
        <TypewriterText />
      </div>

      <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-blue-500 transition mt-6">
        Explore Deals
      </button>
    </div>
  );
};

const words = [
  "Buy now...",
  "Save big!",
  "Limited time offers!",
  "Best prices ever!",
];

const TypewriterText = () => {
  const [index, setIndex] = React.useState(0);
  const [subIndex, setSubIndex] = React.useState(0);
  const [reverse, setReverse] = React.useState(false);

  React.useEffect(() => {
    if (index === words.length) return;

    const timeout = setTimeout(
      () => {
        if (!reverse) {
          setSubIndex((prev) => prev + 1);
          if (subIndex === words[index].length) {
            setReverse(true);
            setTimeout(() => {}, 1000);
          }
        } else {
          setSubIndex((prev) => prev - 1);
          if (subIndex === 0) {
            setReverse(false);
            setIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      reverse ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  return <span>{words[index].substring(0, subIndex)}</span>;
};

export default PromoCard;
