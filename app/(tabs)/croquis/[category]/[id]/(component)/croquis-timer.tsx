"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/solid";

import Timer from "./timer";
import ImageNavigator from "./image-navigator";
import TimeModal from "./time-model";
import useCroquisTimer from "./use-croquis-timer";

export default function CroquisTimer({ userId }: { userId: number }) {
  const {
    setIsTimerRunning,
    pose,
    isLoading,
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
    setIsModalOpen,
    handleSelectChange,
    startTimer,
    handleNext,
    handlePrevious,
    resetTimer,
    handleTimerClick,
    currentCategory,
  } = useCroquisTimer(userId);

  if (isLoading || !pose)
    return (
      <div className="flex justify-center items-center">
        <div className="w-1/4 h-72 border-neutral-700 border-4 rounded-md border-dashed flex justify-center items-center text-neutral-700">
          <PhotoIcon className="size-28" />
        </div>
      </div>
    );

  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col relative h-screen justify-center items-center"
        ref={constraintsRef}
      >
        {/* 로딩 스피너 */}
        {!isImageLoaded && (
          <div className="absolute inset-0 z-0 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300"></div>
          </div>
        )}

        <Image
          src={pose.urls.regular}
          alt={pose.alt_description}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className={`z-0 object-contain ${isImageLoaded ? "block" : "hidden"}`}
          onLoad={() => setIsImageLoaded(true)}
        />

        {/* 타이머 및 버튼 */}
        <motion.div
          className="bg-black bg-opacity-30 rounded-2xl p-6 flex flex-col justify-center items-center shadow-lg z-10"
          ref={timerRef}
          drag
          dragConstraints={constraintsRef}
          dragElastic={1}
        >
          <Timer
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
