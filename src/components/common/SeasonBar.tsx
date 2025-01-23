"use client";

import React from "react";
import Image from "next/image";

interface SeasonBarProps {
  selectedSeason: string | null; // 선택된 계절이 없을 수 있으므로 null 가능
  onSeasonSelect: (season: string) => void; // 계절을 선택하는 함수
}

const SeasonBar: React.FC<SeasonBarProps> = ({
  selectedSeason,
  onSeasonSelect,
}) => {
  const seasonData = [
    {
      season: "봄",
      imageSrc: "/images/season/spring.png",
      title: "봄 추천 여행지",
      description: "봄의 길목, 꽃향기에 취하다",
    },
    {
      season: "여름",
      imageSrc: "/images/season/summer.png",
      title: "여름 추천 여행지",
      description: "푸른 바다, 여름을 만나다",
    },
    {
      season: "가을",
      imageSrc: "/images/season/autumn.png",
      title: "가을 추천 여행지",
      description: "가을의 품, 단풍을 만끽하다",
    },
    {
      season: "겨울",
      imageSrc: "/images/season/winter.png",
      title: "겨울 추천 여행지",
      description: "겨울의 정수, 눈꽃 속 여행",
    },
  ];

  return (
    <div className="flex justify-center items-center mt-3 w-full gap-16">
      {seasonData.map((season) => (
        <div
          key={season.season}
          className={`flex flex-col items-center cursor-pointer transition-all p-4 rounded-md ${
            selectedSeason === season.season
              ? "bg-sky-200 shadow-lg scale-105"
              : "hover:bg-sky-100 hover:shadow-xl hover:scale-105 "
          }`}
          onClick={() => onSeasonSelect(season.season)}
        >
          {/* 계절 이미지 */}
          <Image
            src={season.imageSrc}
            alt={season.season}
            width={72}
            height={72}
            className="object-cover rounded-md"
          />
          <span className="text-lg font-semi-bold text-neutral-800 mt-2">
            {season.title}
          </span>
          <span className="text-base font-normal text-neutral-500 mt-2">
            {season.description}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SeasonBar;
