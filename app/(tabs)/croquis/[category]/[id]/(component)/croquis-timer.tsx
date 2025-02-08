"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PhotoIcon,
  PlayIcon,
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
  imageUrl: string;
  urls: {
    full: string;
    regular: string;
  };
  alt_description: string;
}

export default function CroquisTimer({ userId }: { userId: number }) {
  const { category } = useParams();
  const currentCategory = Array.isArray(category)
    ? category[0]
    : category || "";
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(selectedTime);
  const [isPaused, setIsPaused] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });

  const timerRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    if (timerRef.current) {
      const { top, left, width } = timerRef.current.getBoundingClientRect();
      setModalPosition({ top, left, width });
    }
  }, [isModalOpen]);

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

  const handleSelectChange = (time: string | number) => {
    if (typeof time === "number") {
      handleTimeChange(time);
      setIsModalOpen(false); // 시간이 선택되면 모달 닫기
    }
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const handleTimerClick = () => {
    setIsModalOpen(true); // 타이머 클릭 시 모달 열기
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
          src={pose.urls.regular}
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
          ref={timerRef}
          className="bg-black bg-opacity-30 rounded-2xl p-6 flex flex-col justify-center items-center shadow-lg z-10"
          drag
          dragConstraints={constraintsRef}
          dragElastic={1}
        >
          <div className="flex items-center justify-between w-full">
            <div
              onClick={resetTimer}
              className="cursor-pointer hover:scale-110 transition-all size-6 text-white"
            >
              <ArrowPathIcon />
            </div>
            {/* 타이머 시간 표시 클릭 시 모달 열림 */}
            <p
              onClick={handleTimerClick}
              className="text-4xl font-extrabold text-white cursor-pointer hover:text-gray-200 transition-colors"
            >
              {formatTime(timeLeft ?? selectedTime)}
            </p>

            <div className="cursor-pointer hover:scale-110 transition-all">
              <FavoriteButton
                imageUrl={pose.urls.full}
                imageId={pose.id}
                userId={userId}
                category={currentCategory}
              />
            </div>
          </div>

          {/* 네비게이션 버튼 */}
          <div className="flex items-center space-x-4 mt-4">
            <button
              className="text-white px-4 py-2 rounded"
              onClick={handlePrevious}
            >
              <ChevronLeftIcon className="size-8 hover:text-gray-200 transition-colors" />
            </button>

            {!isTimerRunning ? (
              <button
                onClick={startTimer}
                className="text-white py-3 px-6 hover:text-gray-200 transition-colors"
              >
                <PlayIcon className="size-8" />
              </button>
            ) : (
              <button
                onClick={() => setIsTimerRunning(false)}
                className="text-white py-3 px-6 hover:text-gray-200 transition-colors"
              >
                <PauseIcon className="size-8" />
              </button>
            )}

            <button
              className="text-white px-4 py-2 rounded"
              onClick={handleNext}
            >
              <ChevronRightIcon className="size-8 hover:text-gray-200 transition-colors" />
            </button>
          </div>
        </motion.div>

        {/* 모달 - 시간 선택 */}
        {isModalOpen && (
          <motion.div
            className="absolute z-30"
            style={{
              top: `${modalPosition.top - 100}px`,
              left: `${modalPosition.left}px`,
              width: `${modalPosition.width}px`,
            }}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          >
            <div className="bg-white p-6 rounded-2xl shadow-xl z-20">
              <div className="space-y-2">
                {timeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelectChange(option.value)}
                    className="block w-full py-3 text-lg font-medium text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
