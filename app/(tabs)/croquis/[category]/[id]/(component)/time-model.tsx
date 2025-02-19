// TimeModal.tsx
import { motion } from "framer-motion";
import { timeOptions } from "@/constants";

interface TimeModalProps {
  position: { top: number; left: number; width: number };
  onSelect: (time: number) => void;
  onClose: () => void;
}

export default function TimeModal({
  position,
  onSelect,
  onClose,
}: TimeModalProps) {
  return (
    <motion.div
      className="absolute z-30"
      style={{
        top: `${position.top - 100}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
    >
      <div className="bg-white p-6 rounded-2xl shadow-xl z-20">
        <div className="space-y-2">
          {timeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className="block w-full py-3 text-lg font-medium text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
