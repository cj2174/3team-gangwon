"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { PlaceParam } from "@/types/types";
import { useSearchParams, useRouter } from "next/navigation";
import FestivalCardList from "@/components/fetival/FestivalCardList";
import FestivalSearchBar from "@/components/fetival/FestivalSearchBar";

export default function Festival() {

   type festivalDate = {
      month ?: string
   }

   // URL에서 파라미터 읽어오기
   const searchParams = useSearchParams();
   const router = useRouter();

   //파라미터 가져오기
   const nowCategory = searchParams.get("cat"); // 기본값 'festival'
   const nowFilter = searchParams.get("filter");
   const nowPage = Number(searchParams.get("page"));
   const nowDetail = searchParams.get("detail");
   const nowMonth = searchParams.get("month");
   const [selected, setSelected] = useState<PlaceParam & festivalDate>({ cat: nowCategory, page: nowPage });

   // URL 변경 함수
   const handleUrlChange = (selectedParam: PlaceParam & festivalDate) => {
      let queryString = `?cat=${selectedParam.cat}&page=${selectedParam.page}`;
      if (selectedParam.filter) {
         queryString += `&filter=${selectedParam.filter}`;
      }
      if (selectedParam.detail) {
         queryString += `&detail=${selectedParam.detail}`;
      }
      if(selectedParam.month){
         queryString += `&month=${selectedParam.month}`;
      }
      router.push(queryString, { scroll: false });
      setSelected(selectedParam);
   };

   // 기본 파라미터 설정 (cat이 없을 경우 total로 설정)
   useEffect(() => {
      setSelected((prev) => ({
         cat: nowCategory || prev.cat || "total", // ✅ 기존 값 유지
         page: nowPage || prev.page || 1, // ✅ 기존 값 유지
         filter: nowFilter || prev.filter, // ✅ 기존 값 유지
         detail: nowDetail || prev.detail, // ✅ 기존 값 유지
         month: nowMonth || prev.month || "", // ✅ 기존 값 유지
      }));
   }, [nowCategory, nowFilter, nowPage, nowDetail, nowMonth]); // ✅ router는 제외


   return (
      <div>
         <Header />
         <div className="relative py-20 bg-[url(/images/festival/banner_festival.png)] flex flex-col items-center justify-center gap-6">
            <div className="text-white text-center">
               <h2 className="text-4xl font-bold leading-normal">
                  강원도에서 즐기는 <br /> 다채로운 축제와 공연/행사!
               </h2>
            </div>
            <FestivalSearchBar 
               key={`${selected.cat}-${selected.page}-${selected.filter}`} // ✅ Key 추가
               selected={selected} 
               changeUrl={handleUrlChange} 
            />
         </div>

         <FestivalCardList 
            key={`${selected.cat}-${selected.page}-${selected.filter}`} 
            selected={selected} 
            changeUrl={handleUrlChange} 
         />
         <Footer />
      </div>
   );
}
