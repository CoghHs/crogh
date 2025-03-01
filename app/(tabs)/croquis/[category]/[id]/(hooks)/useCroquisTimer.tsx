"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchRandomPoses } from "@/api/croquies";

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

export default function useCroquisTimer(userId: number) {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });

  const timerRef = useRef<HTMLDivElement | null>(null);
  const constraintsRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isLoading } =
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

  const sendNotificationAndSound = () => {
    if (Notification.permission === "granted") {
      new Notification("타이머 종료!", { body: "타이머가 종료되었습니다." });
      const audio = new Audio("/sounds/alarm.mp3");
      audio.play();
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      sendNotificationAndSound();
      setIsTimerRunning(false);
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
    setTimeLeft(selectedTime);
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
    setTimeLeft(time ?? 60);
    setIsTimerRunning(false);
  };

  const handleSelectChange = (time: string | number) => {
    if (typeof time === "number") {
      handleTimeChange(time);
      setIsModalOpen(false);
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

  return {
    setIsTimerRunning,
    currentCategory,
    currentIndex,
    poses,
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
    handleTimeChange,
    handleSelectChange,
    startTimer,
    handleNext,
    handlePrevious,
    resetTimer,
    handleTimerClick,
    setModalPosition,
  };
}
