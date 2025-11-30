"use client";

import { AppContainer } from "@/app/components/Apps/AppContainer";
import { CalculatorButton } from "./CalculatorButton";
import { useCalculator, Operator } from "./useCalculator";
import Image from "next/image";

// Icons for the header
function HistoryIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="8" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="8" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="8" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <rect
        x="4"
        y="2"
        width="16"
        height="20"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="6"
        y="4"
        width="12"
        height="5"
        rx="1"
        fill="currentColor"
        opacity="0.3"
      />
      <circle cx="8" cy="12" r="1.2" />
      <circle cx="12" cy="12" r="1.2" />
      <circle cx="16" cy="12" r="1.2" />
      <circle cx="8" cy="16" r="1.2" />
      <circle cx="12" cy="16" r="1.2" />
      <circle cx="16" cy="16" r="1.2" />
      <circle cx="8" cy="20" r="1.2" />
      <circle cx="12" cy="20" r="1.2" />
      <circle cx="16" cy="20" r="1.2" />
    </svg>
  );
}

export function Calculator() {
  const {
    display,
    equation,
    showClear,
    activeOperator,
    inputDigit,
    inputDecimal,
    inputOperator,
    inputEquals,
    clear,
    deleteDigit,
    toggleSign,
    percentage,
  } = useCalculator();

  // Calculate display font size based on content length
  const getDisplayFontSize = () => {
    const length = display.length;
    if (length <= 6) return "64px";
    if (length <= 8) return "52px";
    if (length <= 10) return "44px";
    return "36px";
  };

  return (
    <AppContainer
      appId="calculator"
      backgroundColor="#000000"
      statusBarVariant="light"
    >
      <div className="flex flex-col h-full px-4 pb-4">
        {/* Header with icons */}
        <div className="flex justify-between items-center pt-2 pb-4">
          <button className="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center text-[#8E8E93]">
            <HistoryIcon />
          </button>
          <button className="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center text-[#8E8E93]">
            <CalculatorIcon />
          </button>
        </div>

        {/* Display Area */}
        <div className="flex-1 flex flex-col justify-end items-end pr-2 pb-4 min-h-0">
          {/* Equation line - only show when there's an equation */}
          {equation && (
            <div
              className="text-[#8E8E93] text-right mb-1 truncate w-full"
              style={{ fontSize: "20px" }}
            >
              {equation}
            </div>
          )}
          {/* Main display */}
          <div
            className="text-white text-right font-light w-full truncate"
            style={{ fontSize: getDisplayFontSize() }}
          >
            {display}
          </div>
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <CalculatorButton variant="function" onPress={deleteDigit}>
            <Image
              src="/sf-symbols/delete.left.svg"
              alt="Delete"
              width={28}
              height={28}
            />
          </CalculatorButton>
          <CalculatorButton variant="function" onPress={clear}>
            {showClear ? "C" : "AC"}
          </CalculatorButton>
          <CalculatorButton variant="function" onPress={percentage}>
            %
          </CalculatorButton>
          <CalculatorButton
            variant="operator"
            isActive={activeOperator === "÷"}
            onPress={() => inputOperator("÷")}
          >
            ÷
          </CalculatorButton>

          {/* Row 2 */}
          <CalculatorButton onPress={() => inputDigit("7")}>7</CalculatorButton>
          <CalculatorButton onPress={() => inputDigit("8")}>8</CalculatorButton>
          <CalculatorButton onPress={() => inputDigit("9")}>9</CalculatorButton>
          <CalculatorButton
            variant="operator"
            isActive={activeOperator === "×"}
            onPress={() => inputOperator("×")}
          >
            ×
          </CalculatorButton>

          {/* Row 3 */}
          <CalculatorButton onPress={() => inputDigit("4")}>4</CalculatorButton>
          <CalculatorButton onPress={() => inputDigit("5")}>5</CalculatorButton>
          <CalculatorButton onPress={() => inputDigit("6")}>6</CalculatorButton>
          <CalculatorButton
            variant="operator"
            isActive={activeOperator === "-"}
            onPress={() => inputOperator("-")}
          >
            −
          </CalculatorButton>

          {/* Row 4 */}
          <CalculatorButton onPress={() => inputDigit("1")}>1</CalculatorButton>
          <CalculatorButton onPress={() => inputDigit("2")}>2</CalculatorButton>
          <CalculatorButton onPress={() => inputDigit("3")}>3</CalculatorButton>
          <CalculatorButton
            variant="operator"
            isActive={activeOperator === "+"}
            onPress={() => inputOperator("+")}
          >
            +
          </CalculatorButton>

          {/* Row 5 */}
          <CalculatorButton onPress={toggleSign}>
            <span style={{ fontSize: "22px" }}>+/−</span>
          </CalculatorButton>
          <CalculatorButton onPress={() => inputDigit("0")}>0</CalculatorButton>
          <CalculatorButton onPress={inputDecimal}>.</CalculatorButton>
          <CalculatorButton variant="operator" onPress={inputEquals}>
            =
          </CalculatorButton>
        </div>
      </div>
    </AppContainer>
  );
}
