import { timeOptions } from "@/constants";

interface TimerControlsProps {
  handleTimeChange: (time: number | null) => void;
}

export default function TimerControls({
  handleTimeChange,
}: TimerControlsProps) {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTime =
      event.target.value === "null" ? null : Number(event.target.value);
    handleTimeChange(selectedTime);
  };

  return (
    <div className="mb-4">
      <select
        onChange={handleSelectChange}
        className="py-2 bg-gray-500 text-white rounded"
      >
        {timeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
