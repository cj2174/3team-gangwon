"use client";

import { useState } from "react";
import APIConnect from "@/utils/api";
import DBAPI from "@/utils/DBAPI";

export default function AddData() {
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    /**
     * 📌 TourAPI에서 데이터를 가져와 DB에 저장하는 핸들러
     */
    const handleLoadAndSaveData = async () => {
        setLoading(true);
        setStatusMessage("🚀 데이터를 불러오고 있습니다...");
    
        try {
            // ✅ TourAPI에서 전체 관광지 데이터 가져오기
            const tourData = await APIConnect.getTourAreaList(undefined);
    
            if (tourData.length === 0) {
                setStatusMessage("⚠️ 가져올 데이터가 없습니다.");
                setLoading(false);
                return;
            }
    
            setStatusMessage(`✅ ${tourData.length}개의 데이터를 가져왔습니다. 저장을 시작합니다...`);
    
            // ✅ Next.js API(`/api/places`)에 직접 저장 요청 보내기
            for (const placeData of tourData) {
                if (!placeData.contentid || !placeData.title || !placeData.firstimage) {
                    console.log(`⚠️ ${placeData.contentid} ( ${placeData.title} ) 필수 데이터 부족 → 저장하지 않음`);
                    continue;
                }
    
                try {
                    const response = await fetch("/api/places", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(placeData),
                    });
    
                    const result = await response.json();
                    if (result.success) {
                        console.log(`✅ ${placeData.contentid} ( ${placeData.title} ) 저장 완료`);
                    } else {
                        console.log(`❌ ${placeData.contentid} ( ${placeData.title} ) 저장 실패`);
                    }
                } catch (error) {
                    console.error(`🚨 ${placeData.contentid} ( ${placeData.title} ) 저장 중 오류 발생:`, error);
                }
            }
    
            setStatusMessage("🎉 모든 데이터를 성공적으로 저장했습니다!");
        } catch (error) {
            console.error("🚨 데이터 저장 중 오류 발생:", error);
            setStatusMessage("❌ 데이터 저장 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };
    

    /**
     * 📌 기존 handleFestivalDateLoad 유지 (축제 데이터 업데이트)
     */
    const handleFestivalDateLoad = async () => {
        setLoading(true);
        setStatusMessage("📆 축제 데이터를 업데이트 중입니다...");

        try {
            await DBAPI.updateFestivalDate();
            setStatusMessage("🎉 축제 데이터 업데이트 완료!");
        } catch (error) {
            console.error("🚨 축제 데이터 업데이트 중 오류 발생:", error);
            setStatusMessage("❌ 축제 데이터 업데이트 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="text-center py-12">
                <h1 className="text-4xl font-bold">데이터 추가 페이지</h1>
                <p className="text-lg">TourAPI에서 내부 DB로 데이터를 추가하는 페이지입니다.</p>
            </div>
            <hr />
            <div className="flex flex-col items-center gap-4 p-8">
                <button
                    className="bg-sky-500 px-7 py-3 text-xl text-white font-semibold rounded disabled:opacity-50"
                    onClick={handleLoadAndSaveData}
                    disabled={loading}
                >
                    {loading ? "⏳ 데이터 저장 중..." : "📥 전체 데이터 불러와서 저장"}
                </button>

                <button
                    className="bg-green-500 px-7 py-3 text-xl text-white font-semibold rounded disabled:opacity-50"
                    onClick={handleFestivalDateLoad}
                    disabled={loading}
                >
                    {loading ? "⏳ 축제 데이터 업데이트 중..." : "📆 축제 데이터 업데이트"}
                </button>

                {statusMessage && (
                    <p className="text-lg font-semibold text-gray-700">{statusMessage}</p>
                )}
            </div>
        </div>
    );
}
