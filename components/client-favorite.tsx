"use client"; // 클라이언트 컴포넌트로 선언

import { AnimatePresence, motion } from "motion/react";
import ImageNavigator from "@/app/(tabs)/croquis/[category]/[id]/(component)/image-navigator";
import TimeModal from "@/app/(tabs)/croquis/[category]/[id]/(component)/time-model";
import Timer from "@/app/(tabs)/croquis/[category]/[id]/(component)/timer";
import useCroquisTimer from "@/app/(tabs)/croquis/[category]/[id]/(component)/use-croquis-timer";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ClientFavoriteDetailProps {
  user: any;
  image: any;
}

export default function ClientFavoriteDetail({
  user,
  image,
}: ClientFavoriteDetailProps) {
  const {
    selectedTime,
    timeLeft,
    isTimerRunning,
    isPaused,
    isModalOpen,
    setIsModalOpen,
    setIsTimerRunning,
    handleSelectChange,
    startTimer,
    handleNext,
    handlePrevious,
    resetTimer,
    handleTimerClick,
    constraintsRef,
    timerRef,
    isImageLoaded,
  } = useCroquisTimer(user.id);

  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (timerRef.current) {
      const { top, left, width } = timerRef.current.getBoundingClientRect();
      setModalPosition({ top: 0, left: 0, width });
    }
  }, [isModalOpen]);

  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col relative h-screen justify-center items-center"
        ref={constraintsRef}
      >
        {!isImageLoaded && (
          <div className="absolute inset-0 z-0 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300"></div>
          </div>
        )}

        <Image
          src={image.imageUrl}
          alt={image.imageId}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="z-0 pb-6 object-contain"
        />

        {/* 타이머 관련 UI */}
        <motion.div
          className="bg-black bg-opacity-30 rounded-2xl p-6 flex flex-col justify-center items-center shadow-lg z-10 "
          ref={timerRef}
          drag
          dragConstraints={constraintsRef}
          dragElastic={1}
        >
          {/* 타이머 및 네비게이터 추가 */}

          <div className="relative">
            <div className="flex justify-center items-center flex-col">
              <Timer
                imageUrl={image.imageUrl}
                imageId={image.imageId}
                userId={user.id}
                currentCategory={image.category}
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
                isNavigationEnabled={false}
              />
            </div>

            {/* 타이머 모달 위치 설정 */}
            <div className="absolute top-0 left-4">
              {isModalOpen && (
                <TimeModal
                  position={modalPosition}
                  onSelect={handleSelectChange}
                />
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
