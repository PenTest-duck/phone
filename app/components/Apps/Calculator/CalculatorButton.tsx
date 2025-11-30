"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export type ButtonVariant = "number" | "operator" | "function";

interface CalculatorButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  isActive?: boolean;
  onPress: () => void;
}

const variantStyles: Record<
  ButtonVariant,
  { bg: string; text: string; activeBg?: string }
> = {
  number: {
    bg: "#333333",
    text: "#FFFFFF",
  },
  operator: {
    bg: "#FF9F0A",
    text: "#FFFFFF",
    activeBg: "#FFFFFF",
  },
  function: {
    bg: "#A5A5A5",
    text: "#FFFFFF",
  },
};

export function CalculatorButton({
  children,
  variant = "number",
  isActive = false,
  onPress,
}: CalculatorButtonProps) {
  const styles = variantStyles[variant];

  // When operator is active, swap colors
  const backgroundColor =
    isActive && styles.activeBg ? styles.activeBg : styles.bg;
  const textColor =
    isActive && variant === "operator" ? "#FF9F0A" : styles.text;

  return (
    <motion.button
      className="flex items-center justify-center rounded-full select-none"
      style={{
        backgroundColor,
        color: textColor,
        width: "100%",
        aspectRatio: "1 / 1",
        fontSize: "28px",
        fontWeight: 400,
      }}
      whileTap={{
        opacity: 0.7,
        scale: 0.95,
      }}
      transition={{ duration: 0.1 }}
      onClick={onPress}
    >
      {children}
    </motion.button>
  );
}
