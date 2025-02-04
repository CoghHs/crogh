"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import { fetchRandomPoses } from "@/api/croquies";
import { timeOptions } from "@/constants";
import { formatTime } from "@/lib/utils";
import FavoriteButton from "@/components/timer/favorite-button";

interface PosePage {
  results: PoseProps[];
  totalPages: number;
}

interface PoseProps {
  id: string;
  urls: {
    full: string;
  };
  alt_description: string;
}

export default function CroquisTimer({ userId }: { userId: number }) {
  const { category } = useParams();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(selectedTime);
  const [isPaused, setIsPaused] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const constraintsRef = useRef(null);

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
    if (currentIndex >= poses.length - 2 && hasNextPage) {
      fetchNextPage();
    }
  }, [currentIndex, poses.length, hasNextPage, fetchNextPage]);

  // 타이머 종료 시 알림 및 소리 재생
  const sendNotificationAndSound = () => {
    if (Notification.permission === "granted") {
      new Notification("타이머 종료!", { body: "타이머가 종료되었습니다." });
      const audio = new Audio("/sounds/alarm.mp3");
      audio.play();
    }
  };

  // 타이머 동작 제어
  useEffect(() => {
    if (timeLeft === 0) {
      sendNotificationAndSound();
      setIsTimerRunning(false); // 타이머 종료 후 자동으로 멈춤
    }

    let interval: NodeJS.Timeout | undefined;
    if (isTimerRunning && !isPaused && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) =>
          prevTime && prevTime > 0 ? prevTime - 1 : 0
        );
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timeLeft, isTimerRunning, isPaused]);

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(selectedTime); // 타이머를 초기화
  };

  const handleNext = () => {
    if (currentIndex === poses.length - 1 && hasNextPage) {
      fetchNextPage();
    } else {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % poses.length);
    }
    resetTimer();
    setIsImageLoaded(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? poses.length - 1 : prevIndex - 1
    );
    resetTimer();
    setIsImageLoaded(false);
  };

  const handleTimeChange = (time: number | null) => {
    setSelectedTime(time ?? 60);
    setTimeLeft(time ?? 60); // 시간이 변경될 때 타이머 리셋
    setIsTimerRunning(false);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTime =
      event.target.value === "null" ? null : Number(event.target.value);
    handleTimeChange(selectedTime);
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

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
        className="flex flex-col h-screen justify-center items-center"
        ref={constraintsRef}
      >
        {/* 로딩 스피너 */}
        {!isImageLoaded && (
          <div className="absolute inset-0 z-0 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300"></div>
          </div>
        )}

        <Image
          src={pose.urls.full}
          alt={pose.alt_description}
          layout="fill"
          objectFit="contain"
          priority
          className={`z-0 pt-24 pb-6 px-10 ${
            isImageLoaded ? "block" : "hidden"
          }`}
          onLoadingComplete={() => setIsImageLoaded(true)}
        />

        {/* 타이머 및 버튼 */}
        <motion.div
          className="bg-black bg-opacity-30 rounded-2xl p-6 flex flex-col justify-center items-center shadow-lg z-10"
          drag
          dragConstraints={constraintsRef}
          dragElastic={1}
        >
          {/* Favorite 버튼 */}
          <motion.div
            className=" bg-white rounded-full shadow-xl cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FavoriteButton imageId={pose.urls.full} userId={userId} />
          </motion.div>
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
          <p className="text-4xl font-extrabold text-white">
            {formatTime(timeLeft ?? selectedTime)}
          </p>

          {/* 네비게이션 버튼과 타이머 */}
          <div className="flex items-center space-x-4 mt-4">
            <button
              className="text-white px-4 py-2 rounded"
              onClick={handlePrevious}
            >
              <ChevronLeftIcon className="size-10" />
            </button>

            {!isTimerRunning ? (
              <button
                onClick={startTimer}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-6 rounded-full transform hover:scale-105 transition-all shadow-lg"
              >
                ⏱️
              </button>
            ) : (
              <button
                onClick={() => setIsTimerRunning(false)}
                className="bg-yellow-500 text-white py-3 px-6 rounded"
              >
                ⏸️
              </button>
            )}

            <button
              className=" text-white px-4 py-2 rounded"
              onClick={handleNext}
            >
              <ChevronRightIcon className="size-10" />
            </button>
          </div>
        </motion.div>

        {isFetchingNextPage && (
          <div className="mt-4">
            <p className="text-sm text-neutral-400">Loading more poses...</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
