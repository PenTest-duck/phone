"use client";

import { useState, useCallback } from "react";

export type Operator = "+" | "-" | "×" | "÷" | null;

interface CalculatorState {
  display: string;
  equation: string;
  previousValue: number | null;
  operator: Operator;
  waitingForOperand: boolean;
  justPressedEquals: boolean;
  lastOperand: number | null;
  lastOperator: Operator;
  hasError: boolean;
}

const MAX_DIGITS = 9;

const initialState: CalculatorState = {
  display: "0",
  equation: "",
  previousValue: null,
  operator: null,
  waitingForOperand: false,
  justPressedEquals: false,
  lastOperand: null,
  lastOperator: null,
  hasError: false,
};

// Format number with thousand separators
export function formatNumber(num: number | string): string {
  const str = typeof num === "string" ? num : String(num);

  // Handle special cases
  if (
    str === "Error" ||
    str === "Infinity" ||
    str === "-Infinity" ||
    str === "NaN"
  ) {
    return "Error";
  }

  // Check for scientific notation
  if (str.includes("e")) {
    return str;
  }

  const parts = str.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Add thousand separators to integer part
  const isNegative = integerPart.startsWith("-");
  const absInteger = isNegative ? integerPart.slice(1) : integerPart;
  const formattedInteger = absInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const signedInteger = isNegative ? "-" + formattedInteger : formattedInteger;

  if (decimalPart !== undefined) {
    return signedInteger + "." + decimalPart;
  }
  return signedInteger;
}

// Parse formatted number back to number string (remove commas)
function parseDisplay(display: string): string {
  return display.replace(/,/g, "");
}

// Format for display with digit limit
function formatForDisplay(num: number): string {
  if (!isFinite(num) || isNaN(num)) {
    return "Error";
  }

  // Handle very large or very small numbers with scientific notation
  if (Math.abs(num) >= 1e9 || (Math.abs(num) < 1e-9 && num !== 0)) {
    const exp = num.toExponential(5);
    return exp;
  }

  // Convert to string and limit precision
  let str = String(num);

  // If the number has too many digits, round it
  const parts = str.split(".");
  const integerDigits = parts[0].replace("-", "").length;

  if (integerDigits > MAX_DIGITS) {
    return num.toExponential(5);
  }

  if (parts[1]) {
    const maxDecimalDigits = MAX_DIGITS - integerDigits;
    if (maxDecimalDigits > 0) {
      const rounded = num.toFixed(maxDecimalDigits);
      // Remove trailing zeros
      str = parseFloat(rounded).toString();
    } else {
      str = Math.round(num).toString();
    }
  }

  return str;
}

// Get operator symbol for display
function getOperatorSymbol(op: Operator): string {
  switch (op) {
    case "+":
      return "+";
    case "-":
      return "−";
    case "×":
      return "×";
    case "÷":
      return "÷";
    default:
      return "";
  }
}

// Perform calculation
function calculate(left: number, operator: Operator, right: number): number {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "×":
      return left * right;
    case "÷":
      return right === 0 ? NaN : left / right;
    default:
      return right;
  }
}

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>(initialState);

  // Check if we should show "C" instead of "AC"
  const showClear = state.display !== "0" || state.operator !== null;

  // Input a digit
  const inputDigit = useCallback((digit: string) => {
    setState((prev) => {
      if (prev.hasError) {
        return { ...initialState, display: digit };
      }

      if (prev.waitingForOperand || prev.justPressedEquals) {
        return {
          ...prev,
          display: digit,
          waitingForOperand: false,
          justPressedEquals: false,
          equation: prev.justPressedEquals ? "" : prev.equation,
        };
      }

      const currentDisplay = parseDisplay(prev.display);

      // Limit digits
      const digitsCount = currentDisplay.replace(/[^0-9]/g, "").length;
      if (digitsCount >= MAX_DIGITS) {
        return prev;
      }

      const newDisplay =
        currentDisplay === "0" ? digit : currentDisplay + digit;
      return {
        ...prev,
        display: formatNumber(newDisplay),
      };
    });
  }, []);

  // Input decimal point
  const inputDecimal = useCallback(() => {
    setState((prev) => {
      if (prev.hasError) {
        return { ...initialState, display: "0." };
      }

      if (prev.waitingForOperand || prev.justPressedEquals) {
        return {
          ...prev,
          display: "0.",
          waitingForOperand: false,
          justPressedEquals: false,
          equation: prev.justPressedEquals ? "" : prev.equation,
        };
      }

      const currentDisplay = parseDisplay(prev.display);
      if (currentDisplay.includes(".")) {
        return prev;
      }

      return {
        ...prev,
        display: prev.display + ".",
      };
    });
  }, []);

  // Handle operator input
  const inputOperator = useCallback((nextOperator: Operator) => {
    setState((prev) => {
      if (prev.hasError) {
        return prev;
      }

      const currentValue = parseFloat(parseDisplay(prev.display));

      if (prev.previousValue === null) {
        return {
          ...prev,
          previousValue: currentValue,
          operator: nextOperator,
          waitingForOperand: true,
          justPressedEquals: false,
          equation: "",
        };
      }

      if (prev.waitingForOperand) {
        // Just change the operator
        return {
          ...prev,
          operator: nextOperator,
        };
      }

      // Perform the pending operation
      const result = calculate(prev.previousValue, prev.operator, currentValue);
      const formattedResult = formatForDisplay(result);
      const hasError = formattedResult === "Error";

      return {
        ...prev,
        display: hasError ? "Error" : formatNumber(formattedResult),
        previousValue: hasError ? null : result,
        operator: hasError ? null : nextOperator,
        waitingForOperand: true,
        justPressedEquals: false,
        hasError,
        equation: "",
      };
    });
  }, []);

  // Handle equals
  const inputEquals = useCallback(() => {
    setState((prev) => {
      if (prev.hasError) {
        return prev;
      }

      let left: number;
      let right: number;
      let op: Operator;

      if (
        prev.justPressedEquals &&
        prev.lastOperator &&
        prev.lastOperand !== null
      ) {
        // Repeat last operation
        left = parseFloat(parseDisplay(prev.display));
        right = prev.lastOperand;
        op = prev.lastOperator;
      } else if (prev.previousValue !== null && prev.operator) {
        left = prev.previousValue;
        right = parseFloat(parseDisplay(prev.display));
        op = prev.operator;
      } else {
        return prev;
      }

      const result = calculate(left, op, right);
      const formattedResult = formatForDisplay(result);
      const hasError = formattedResult === "Error";

      // Build equation string
      const equationStr = `${formatNumber(
        formatForDisplay(left)
      )}${getOperatorSymbol(op)}${formatNumber(formatForDisplay(right))}`;

      return {
        ...prev,
        display: hasError ? "Error" : formatNumber(formattedResult),
        equation: hasError ? "" : equationStr,
        previousValue: null,
        operator: null,
        waitingForOperand: false,
        justPressedEquals: true,
        lastOperand: right,
        lastOperator: op,
        hasError,
      };
    });
  }, []);

  // Clear (AC or C)
  const clear = useCallback(() => {
    setState((prev) => {
      // If showing "C", just clear current entry
      if (
        prev.display !== "0" &&
        prev.operator !== null &&
        !prev.waitingForOperand
      ) {
        return {
          ...prev,
          display: "0",
        };
      }
      // Full clear (AC)
      return initialState;
    });
  }, []);

  // Delete last digit
  const deleteDigit = useCallback(() => {
    setState((prev) => {
      if (prev.hasError || prev.waitingForOperand || prev.justPressedEquals) {
        return { ...initialState };
      }

      const currentDisplay = parseDisplay(prev.display);

      if (
        currentDisplay.length <= 1 ||
        (currentDisplay.length === 2 && currentDisplay.startsWith("-"))
      ) {
        return {
          ...prev,
          display: "0",
        };
      }

      const newDisplay = currentDisplay.slice(0, -1);
      return {
        ...prev,
        display: formatNumber(newDisplay),
      };
    });
  }, []);

  // Toggle positive/negative
  const toggleSign = useCallback(() => {
    setState((prev) => {
      if (prev.hasError) {
        return prev;
      }

      const currentDisplay = parseDisplay(prev.display);
      const currentValue = parseFloat(currentDisplay);

      if (currentValue === 0) {
        return prev;
      }

      const newValue = -currentValue;
      return {
        ...prev,
        display: formatNumber(formatForDisplay(newValue)),
      };
    });
  }, []);

  // Percentage
  const percentage = useCallback(() => {
    setState((prev) => {
      if (prev.hasError) {
        return prev;
      }

      const currentDisplay = parseDisplay(prev.display);
      const currentValue = parseFloat(currentDisplay);

      let result: number;

      if (prev.previousValue !== null && prev.operator) {
        // Calculate percentage of the previous value
        result = prev.previousValue * (currentValue / 100);
      } else {
        // Just divide by 100
        result = currentValue / 100;
      }

      const formattedResult = formatForDisplay(result);
      return {
        ...prev,
        display: formatNumber(formattedResult),
        waitingForOperand: false,
      };
    });
  }, []);

  return {
    display: state.display,
    equation: state.equation,
    showClear,
    activeOperator: state.waitingForOperand ? state.operator : null,
    inputDigit,
    inputDecimal,
    inputOperator,
    inputEquals,
    clear,
    deleteDigit,
    toggleSign,
    percentage,
  };
}
