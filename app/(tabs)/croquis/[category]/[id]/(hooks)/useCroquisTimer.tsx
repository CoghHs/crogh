"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
    raw: string;
    full: string;
    regular: string;
  };
  alt_description: string;
}

interface TimerState {
  selectedTime: number;
  timeLeft: number | null;
  isRunning: boolean;
  isPaused: boolean;
}

interface ModalPosition {
  top: number;
  left: number;
  width: number;
}

export default function useCroquisTimer(userId: number) {
  const { category } = useParams();
  const currentCategory = Array.isArray(category)
    ? category[0]
    : category || "";

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // 타이머 관련 상태 통합
  const [timerState, setTimerState] = useState<TimerState>({
    selectedTime: 60,
    timeLeft: 60,
    isRunning: false,
    isPaused: false,
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    position: { top: 0, left: 0, width: 0 } as ModalPosition,
  });

  const timerRef = useRef<HTMLDivElement | null>(null);
  const constraintsRef = useRef(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // React Query로 데이터 페칭
  const { data, fetchNextPage, hasNextPage, isLoading, error } =
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

  // 중복 제거된 포즈 목록 생성
  const poses = useCallback(() => {
    if (!data?.pages) return [];

    const allPoses = data.pages.flatMap((page) => page.results);
    const uniquePoses: PoseProps[] = [];
    const seenIds = new Set<string>();

    allPoses.forEach((pose) => {
      if (!seenIds.has(pose.id)) {
        seenIds.add(pose.id);
        uniquePoses.push(pose);
      }
    });

    return uniquePoses;
  }, [data?.pages]);

  const uniquePoses = poses();
  const pose = uniquePoses[currentIndex];

  // useCroquisTimer 훅 내부에 추가할 코드

  // 이미지 사전 로딩을 위한 상태와 함수 추가
  const [preloadedImages, setPreloadedImages] = useState<Map<string, boolean>>(
    new Map()
  );

  // 이미지 사전 로딩 함수
  const preloadImage = useCallback(
    (imageUrl: string, imageId: string) => {
      // 이미 프리로드된 이미지는 다시 로드하지 않음
      if (preloadedImages.has(imageId)) return;

      const img = new Image();
      img.onload = () => {
        setPreloadedImages((prev) => {
          const newMap = new Map(prev);
          newMap.set(imageId, true);
          return newMap;
        });
      };
      img.src = imageUrl;
    },
    [preloadedImages]
  );

  // 다음 몇 개의 이미지를 미리 로드하는 함수
  const preloadNextImages = useCallback(
    (count: number = 3) => {
      for (let i = 1; i <= count; i++) {
        const nextIndex = (currentIndex + i) % uniquePoses.length;
        if (nextIndex < uniquePoses.length && uniquePoses[nextIndex]) {
          const nextPose = uniquePoses[nextIndex];
          preloadImage(nextPose.urls.regular, nextPose.id);
        }
      }
    },
    [currentIndex, uniquePoses, preloadImage]
  );

  // 현재 이미지가 로드된 후 다음 이미지들 미리 로드
  useEffect(() => {
    if (isImageLoaded && uniquePoses.length > 0) {
      preloadNextImages();
    }
  }, [isImageLoaded, uniquePoses, preloadNextImages]);

  // 새 페이지가 로드될 때도 이미지 사전 로드
  useEffect(() => {
    if (data?.pages && data.pages.length > 0 && uniquePoses.length > 0) {
      preloadNextImages();
    }
  }, [data?.pages, uniquePoses, preloadNextImages]);

  // 무한 스크롤 최적화: 더 일찍 다음 페이지 미리 로딩
  useEffect(() => {
    if (currentIndex >= uniquePoses.length - 5 && hasNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [currentIndex, uniquePoses.length, hasNextPage, fetchNextPage, isLoading]);

  // 모달 위치 업데이트
  useEffect(() => {
    if (timerRef.current && modalState.isOpen) {
      const { top, left, width } = timerRef.current.getBoundingClientRect();
      setModalState((prev) => ({
        ...prev,
        position: { top, left, width },
      }));
    }
  }, [modalState.isOpen]);

  // 타이머 효과
  useEffect(() => {
    const { timeLeft, isRunning, isPaused } = timerState;

    if (timeLeft === 0) {
      sendNotificationAndSound();
      setTimerState((prev) => ({ ...prev, isRunning: false }));
    }

    let interval: NodeJS.Timeout | undefined;

    if (isRunning && !isPaused && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimerState((prev) => ({
          ...prev,
          timeLeft:
            prev.timeLeft !== null && prev.timeLeft > 0 ? prev.timeLeft - 1 : 0,
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState]);

  // 알림 및 소리 재생
  const sendNotificationAndSound = useCallback(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("타이머 종료!", { body: "타이머가 종료되었습니다." });

        // 오디오 요소 생성 및 재생
        if (!audioRef.current) {
          audioRef.current = new Audio("/sounds/alarm.mp3");
        }

        audioRef.current.play().catch((err) => {
          console.error("알림음 재생 중 오류:", err);
        });
      }
    }
  }, []);

  // 알림 권한 요청
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission !== "granted"
    ) {
      Notification.requestPermission();
    }

    // 메모리 누수 방지를 위한 정리
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // 타이머 재설정
  const resetTimer = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      isRunning: false,
      timeLeft: prev.selectedTime,
    }));
  }, []);

  // 다음 이미지로 이동
  const handleNext = useCallback(() => {
    if (currentIndex === uniquePoses.length - 1 && hasNextPage) {
      fetchNextPage();
    }

    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % Math.max(uniquePoses.length, 1)
    );
    resetTimer();
    setIsImageLoaded(false);
  }, [
    currentIndex,
    uniquePoses.length,
    hasNextPage,
    fetchNextPage,
    resetTimer,
  ]);

  // 이전 이미지로 이동
  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(uniquePoses.length - 1, 0) : prevIndex - 1
    );
    resetTimer();
    setIsImageLoaded(false);
  }, [uniquePoses.length, resetTimer]);

  // 타이머 시간 변경
  const handleTimeChange = useCallback((time: number | null) => {
    const newTime = time ?? 60;
    setTimerState((prev) => ({
      ...prev,
      selectedTime: newTime,
      timeLeft: newTime,
      isRunning: false,
    }));
  }, []);

  // 모달에서 시간 선택
  const handleSelectChange = useCallback(
    (time: string | number) => {
      if (typeof time === "number") {
        handleTimeChange(time);
        setModalState((prev) => ({ ...prev, isOpen: false }));
      }
    },
    [handleTimeChange]
  );

  // 타이머 시작
  const startTimer = useCallback(() => {
    setTimerState((prev) => ({ ...prev, isRunning: true }));
  }, []);

  // 타이머 일시 정지/재개
  const togglePause = useCallback(() => {
    setTimerState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  // 타이머 클릭 핸들러
  const handleTimerClick = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: true }));
  }, []);

  return {
    setIsTimerRunning: (isRunning: boolean) =>
      setTimerState((prev) => ({ ...prev, isRunning })),
    currentCategory,
    currentIndex,
    poses: uniquePoses,
    pose,
    isLoading,
    error,
    isImageLoaded,
    setIsImageLoaded,
    timerRef,
    constraintsRef,
    selectedTime: timerState.selectedTime,
    timeLeft: timerState.timeLeft,
    isTimerRunning: timerState.isRunning,
    isPaused: timerState.isPaused,
    isModalOpen: modalState.isOpen,
    modalPosition: modalState.position,
    setIsModalOpen: (isOpen: boolean) =>
      setModalState((prev) => ({ ...prev, isOpen })),
    handleTimeChange,
    handleSelectChange,
    startTimer,
    togglePause,
    handleNext,
    handlePrevious,
    resetTimer,
    handleTimerClick,
  };
}
