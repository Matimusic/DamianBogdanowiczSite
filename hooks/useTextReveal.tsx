"use client";
import { motion } from "framer-motion";


export const TextReveal = ({ text, delay = 0, color = "#e8e4df" }: { text: string, delay?: number, color?: string }) => {
  // Rozbijamy tekst na słowa, a potem słowa na litery, żeby spacje zachowywały się idealnie
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.02, // Szybszy rytm jest bardziej elegancki
        delayChildren: delay 
      },
    },
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: "120%",      // Startują całkowicie pod "maską"
      rotateX: 80,    // Efekt trójwymiarowego obrotu
      filter: "blur(8px)",
      scale: 0.9      // Lekkie pomniejszenie przy starcie
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        // Używamy precyzyjnego beziera zamiast springa dla luksusowego "smooth" efektu
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1], 
      },
    },
  } as const;

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ 
        display: "inline-block", 
        color,
        perspective: "1000px" // Wymagane dla efektu 3D (rotateX)
      }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: "inline-block", whiteSpace: "nowrap", marginRight: "0.25em" }}>
          {Array.from(word).map((letter, letterIndex) => (
            <span
              key={letterIndex}
              style={{ 
                display: "inline-block", 
                overflow: "hidden", // Maska: litera pojawia się "z niczego"
                verticalAlign: "bottom" 
              }}
            >
              <motion.span
                variants={letterVariants}
                style={{ display: "inline-block" }}
              >
                {letter}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </motion.span>
  );
};