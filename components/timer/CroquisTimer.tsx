"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import ImageNavigator from "./ImageNavigator";
import TimeModal from "./TimeModel";
import TimerDisplay from "./TimerDisplay";
import useCroquisTimer from "@/app/(tabs)/croquis/[category]/[id]/(hooks)/useCroquisTimer";

export default function CroquisTimer({ userId }: { userId: number }) {
  const {
    setIsTimerRunning,
    pose,
    isImageLoaded,
    setIsImageLoaded,
    timerRef,
    constraintsRef,
    selectedTime,
    timeLeft,
    isTimerRunning,
    isPaused,
    isModalOpen,
    modalPosition,
    handleSelectChange,
    startTimer,
    handleNext,
    handlePrevious,
    resetTimer,
    handleTimerClick,
    currentCategory,
  } = useCroquisTimer(userId);

  if (!pose) return null;

  const ImageUrl = `${pose.urls.regular}&w=1980&q=85`;
  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col relative h-screen justify-center items-center"
        ref={constraintsRef}
      >
        {!isImageLoaded && (
          <div className="absolute inset-0 z-10 flex justify-center items-center bg-white">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300" />
          </div>
        )}

        <Image
          src={ImageUrl}
          alt={pose.alt_description}
          fill
          priority
          className={`z-0 object-contain transition-opacity duration-300 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsImageLoaded(true)}
        />

        <motion.div
          className="bg-black bg-opacity-30 rounded-2xl p-6 flex flex-col justify-center items-center shadow-lg z-20"
          ref={timerRef}
          drag
          dragConstraints={constraintsRef}
          dragElastic={1}
        >
          <TimerDisplay
            imageUrl={pose.urls.full}
            imageId={pose.id}
            userId={userId}
            currentCategory={currentCategory}
            selectedTime={selectedTime}
            timeLeft={timeLeft}
            isPaused={isPaused}
            onReset={resetTimer}
            onTimeClick={handleTimerClick}
          />

          <ImageNavigator
            onPrevious={handlePrevious}
            onNext={handleNext}
            onStart={startTimer}
            onPause={() => setIsTimerRunning(false)}
            isTimerRunning={isTimerRunning}
          />
        </motion.div>

        {isModalOpen && (
          <TimeModal position={modalPosition} onSelect={handleSelectChange} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
