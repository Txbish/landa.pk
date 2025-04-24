"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Leaf, HandCoins } from "lucide-react";

const keywords = [
  {
    word: "sustainable",
    icon: <Leaf className="inline-block w-5 h-5 text-green-600 ml-1" />,
  },
  {
    word: "affordable",
    icon: <HandCoins className="inline-block w-5 h-5 text-yellow-500 ml-1" />,
  },
  {
    word: "accessible",
    icon: <Sparkles className="inline-block w-5 h-5 text-blue-500 ml-1" />,
  },
];

export function MissionStatement() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setInterval(() => {
      setIndex((prev) => (prev + 1) % keywords.length);
    }, 2500);
    return () => clearInterval(timeout);
  }, []);

  return (
    <section className="py-16 text-center space-y-4">
      <motion.h2
        className="text-3xl font-bold tracking-tight"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Our Mission
      </motion.h2>

      <motion.p
        className="text-lg text-muted-foreground max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        We believe fashion should be
        <AnimatePresence mode="wait">
          <motion.span
            key={keywords[index].word}
            className="ml-2 font-semibold inline-flex items-center text-landa-green"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {keywords[index].word}
            {keywords[index].icon}
          </motion.span>
        </AnimatePresence>{" "}
        for everyone.
      </motion.p>
    </section>
  );
}
