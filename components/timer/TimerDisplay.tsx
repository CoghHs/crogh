// Timer.tsx
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { formatTime } from "@/lib/utils";
import FavoriteButton from "@/components/button/FavoriteButton";

interface TimerProps {
  selectedTime: number;
  timeLeft: number | null;
  isPaused: boolean;
  onReset: () => void;
  onTimeClick: () => void;
  imageUrl: string;
  imageId: string;
  userId: number;
  currentCategory: string;
}

export default function TimerDisplay({
  selectedTime,
  timeLeft,
  onReset,
  onTimeClick,
  imageUrl,
  imageId,
  userId,
  currentCategory,
}: TimerProps) {
  return (
    <div className="flex items-center justify-between w-56 gap-4">
      <div
        onClick={onReset}
        className="cursor-pointer hover:scale-110 transition-all size-6 text-white"
      >
        <ArrowPathIcon />
      </div>

      <p
        onClick={onTimeClick}
        className="text-4xl font-extrabold text-white cursor-pointer hover:text-gray-200 transition-colors"
      >
        {formatTime(timeLeft ?? selectedTime)}
      </p>
      <FavoriteButton
        imageUrl={imageUrl}
        imageId={imageId}
        userId={userId}
        category={currentCategory}
      />
    </div>
  );
}
