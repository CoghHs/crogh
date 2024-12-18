"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // useParams 사용
import { fetchRandomPoses } from "@/lib/constants";

import Image from "next/image";

import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import TimerControls from "@/components/timer/timer-controls";
import Timer from "@/components/timer/timer";
import NavigationButtons from "@/components/timer/navigation-button";

interface PosePage {
  results: PoseProps[];
  totalPages: number; // 전체 페이지 수
}

interface PoseProps {
  id: string;
  urls: {
    full: string;
  };
  alt_description: string;
}

export default function PoseDetail() {
  const { category } = useParams();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<PosePage>({
      queryKey: ["poses", category],
      queryFn: ({ pageParam = 1 }) => fetchRandomPoses(category as string, 10),
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = Math.floor(Math.random() * lastPage.totalPages) + 1;
        return nextPage <= lastPage.totalPages ? nextPage : undefined;
      },

      enabled: !!category,
      initialPageParam: 1,
    });
  const poses = data?.pages.flatMap((page) => page.results) || [];
  const pose = poses[currentIndex];

  useEffect(() => {
    console.log(category); // category 확인
  }, [category]);

  useEffect(() => {
    if (currentIndex >= poses.length - 2 && hasNextPage) {
      fetchNextPage();
    }
  }, [currentIndex, poses.length, hasNextPage, fetchNextPage]);

  const resetTimer = () => {
    setIsTimerRunning(false);
    setSelectedTime(60); // 리셋 시에도 기본 시간을 1분으로 설정
  };

  const handleNext = () => {
    if (currentIndex === poses.length - 1 && hasNextPage) {
      fetchNextPage();
    } else {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % poses.length);
    }
    resetTimer();
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? poses.length - 1 : prevIndex - 1
    );
    resetTimer();
  };

  const handleTimeChange = (time: number | null) => {
    setSelectedTime(time ?? 60); // 타이머 변경 시에도 기본 시간을 1분으로 설정
    setIsTimerRunning(false);
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  if (isLoading || !pose) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center">
      <Image
        src={pose.urls.full}
        alt={pose.alt_description}
        width={500}
        height={500}
        className="w-1/4 h-1/4 mb-4"
      />

      <AnimatePresence>
        <motion.div className="flex flex-col items-center">
          <TimerControls handleTimeChange={handleTimeChange} />

          {selectedTime !== null && !isTimerRunning && (
            <div className="flex flex-col items-center mb-4">
              <p className="text-lg">Selected Time: {selectedTime / 60} Min</p>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                onClick={startTimer}
              >
                Start
              </button>
            </div>
          )}

          {isTimerRunning && (
            <Timer
              initialTime={selectedTime}
              onTimeout={handleNext}
              isRunning={isTimerRunning}
            />
          )}
        </motion.div>
      </AnimatePresence>
      <NavigationButtons
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />

      {isFetchingNextPage && <p>Loading more poses...</p>}
    </div>
  );
}
