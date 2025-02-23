// ImageNavigator.tsx
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";

interface ImageNavigatorProps {
  onPrevious: () => void;
  onNext: () => void;
  onStart: () => void;
  isTimerRunning: boolean;
  onPause: () => void;
  isNavigationEnabled?: boolean;
}

export default function ImageNavigator({
  isTimerRunning,
  onStart,
  onPrevious,
  onNext,
  onPause,
  isNavigationEnabled = true,
}: ImageNavigatorProps) {
  return (
    <div className="flex items-center space-x-4 mt-4">
      {isNavigationEnabled && (
        <button className="text-white px-4 py-2 rounded" onClick={onPrevious}>
          <ChevronLeftIcon className="size-8 hover:text-gray-200 transition-colors" />
        </button>
      )}

      {!isTimerRunning ? (
        <button
          onClick={onStart}
          className="text-white py-3 px-6 hover:text-gray-200 transition-colors"
        >
          <PlayIcon className="size-8" />
        </button>
      ) : (
        <button
          onClick={onPause}
          className="text-white py-3 px-6 hover:text-gray-200 transition-colors"
        >
          <PauseIcon className="size-8" />
        </button>
      )}

      {isNavigationEnabled && (
        <button className="text-white px-4 py-2 rounded" onClick={onNext}>
          <ChevronRightIcon className="size-8 hover:text-gray-200 transition-colors" />
        </button>
      )}
    </div>
  );
}
