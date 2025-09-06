import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock } from "lucide-react";

export type DayCheckboxProps = {
  id: string;             // must be string to match handler
  day: Date;              // must be Date to match handler
  isCompleted: boolean;
  isFutureDay: boolean;
  isToday: boolean;
  isPastDay: boolean;
  onToggle: (id: string, day: Date) => void;  // strictly matches handler
  ariaLabel?: string;
};


// A polished, accessible, animated checkbox tuned for day-based progress UI.
// - strong focus styles for keyboard users
// - clear disabled states with accessible explanation
// - smooth check/uncheck animation using Framer Motion
// - subtle micro-interactions and improved contrast

export default function DayCheckbox({
  id,
  day,
  isCompleted,
  isFutureDay,
  isToday,
  isPastDay,
  onToggle,
  ariaLabel = "Mark sub-target complete",
}: DayCheckboxProps) {
  const disabled = isFutureDay || !isToday;
  const disabledReason = isFutureDay
    ? "This day is in the future — you can't mark it complete yet."
    : !isToday
    ? "Only today's habits are editable."
    : undefined;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (disabled) return;
    onToggle?.(id, day);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isCompleted}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      title={disabled ? disabledReason : isCompleted ? "Completed" : "Mark complete"}
      tabIndex={disabled ? -1 : 0}
      className={`group relative inline-flex items-center justify-center p-0.5 rounded-full transition-all focus:outline-none
        ${isToday ? "ring-2 ring-primary ring-offset-2" : ""}
        ${isPastDay && !isCompleted ? "opacity-60" : ""}
        ${isFutureDay ? "opacity-30" : ""}
        ${disabled ? "cursor-not-allowed" : "hover:scale-[1.03] active:scale-95"}
      `}
    >
      {/* Visual box */}
      <span
        className={`flex items-center justify-center w-9 h-9 rounded-full shadow-sm transition-colors duration-150
          ${isCompleted ? "bg-gradient-to-br from-green-400 to-green-600" : "bg-white/90 dark:bg-slate-800"}
          ${isToday && !isCompleted ? "border-2 border-primary" : "border border-slate-200 dark:border-slate-700"}
        `}
      >
        <AnimatePresence initial={false} mode="wait">
          {isCompleted ? (
            <motion.span
              key="checked"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              className="flex items-center justify-center"
            >
              <Check size={16} aria-hidden />
            </motion.span>
          ) : (
            <motion.span
              key="unchecked"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex items-center justify-center text-sm text-slate-500"
            >
              {/* show a small clock for future days (visual hint) */}
              {isFutureDay ? <Clock size={14} aria-hidden /> : <span className="w-3 h-3 rounded-full bg-slate-300" />}
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {/* Tooltip (visible to sighted users on hover/focus) */}
      <span
        role="status"
        aria-hidden={disabledReason ? "false" : "true"}
        className={`absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs rounded-md whitespace-nowrap text-white text-center pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-150
          ${disabled ? "bg-slate-700" : "bg-slate-800/90"}
        `}
        style={{ willChange: "opacity" }}
      >
        {disabled ? disabledReason : isCompleted ? "Completed" : "Tap to mark complete"}
      </span>
    </button>
  );
}
