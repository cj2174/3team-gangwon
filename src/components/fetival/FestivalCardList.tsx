"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

import { PlaceParam, ListProps, SelectedChildParam } from "@/types/types";

import EmptyData from "../common/EmptyData";
import EmptyListCard from "../common/EmptyListCard";
import ListCard from "../common/ListCard";
import Pagination from "../common/Pagination";
type ExtraType = {
   month?: string;
   keyword?: string;
};

const FestivalCard: React.FC<SelectedChildParam & { cat2?: string | null }> = ({
   selected = { cat: "festival", page: 1 },
   changeUrl,
   cat2,
}) => {
   const [tourData, setTourData] = useState<ListProps[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [totalPages, setTotalPages] = useState<number>(1);

   const createQueryString = (selected: PlaceParam & ExtraType): string => {
      const params = new URLSearchParams();

      if (selected.cat) params.append("cat", selected.cat);
      if (selected.page) params.append("page", selected.page.toString());
      if (selected.filter) params.append("filter", selected.filter);
      if (selected.detail) params.append("detail", selected.detail);
      if (selected.month) params.append("month", selected.month);
      if (selected.keyword) params.append("keyword", selected.keyword);

      return params.toString(); // 쿼리 문자열 형식으로 반환
   };

   useEffect(() => {
      const fetchData = async () => {
         try {
            let response: ListProps[] = [];

            console.log(`🌸 [API 요청] 관광지 리스트 가져오기 🌸`);
            const queryString = createQueryString(selected);
            const dataList = await fetch(`/api/places?${queryString}`).then((response) => response.json());
            console.log(dataList.message);
            response = dataList.data;
            setTotalPages(Number(dataList.totalPages));
            if (response) {
               setTourData(
                  response.map((item) => ({
                     imageUrl: item.imageUrl,
                     title: item.title,
                     area: item.area,
                     contentId: item.contentId,
                     contentTypeId: item.contentTypeId,
                     cat3: item.cat3,
                  })),
               );
            }
            setLoading(false);
         } catch (err) {
            console.log("❌ API 요청 실패:", err);
            setLoading(false);
         }
      };
      fetchData();
   }, [selected]);

   if (loading) {
      return (
         <div className="w-[1280px] h-[1376px] mx-auto px-6 mt-20">
            <div className="grid grid-cols-3 gap-8">
               <EmptyListCard />
            </div>
         </div>
      );
   }

   if (!tourData.length) {
      return <EmptyData />;
   }

   return (
      <div className="contents-wrap px-6 m-20">
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {tourData.map((item) => (
               <Link key={item.contentId} href={`/explore/festival/detail?contentId=${item.contentId}`}>
                  <ListCard {...item} />
               </Link>
            ))}
         </div>

         {totalPages > 1 && <Pagination totalPages={totalPages} selected={selected} changeUrl={changeUrl} />}
      </div>
   );
};

export default FestivalCard;
