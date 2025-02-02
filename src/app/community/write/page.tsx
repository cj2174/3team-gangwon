"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { createPost } from "@/utils/postapi";
import { AxiosResponse, AxiosError } from "axios";

export default function WritePage() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const channelId = searchParams.get("channelId") || "679f3aba7cd28d7700f70f40";
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");
   const [image, setImage] = useState<File | null>(null);
   const [preview, setPreview] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
         alert("로그인이 필요합니다.");
         router.push("/auth/login");
      }
   }, [router]);

   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         setImage(file);
         setPreview(URL.createObjectURL(file));
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title || !content || loading) return;

      setLoading(true);
      try {
         const token = localStorage.getItem("accessToken");
         if (!token) throw new Error("로그인이 필요합니다.");

         const response: AxiosResponse<{ _id: string }> = await createPost(title, image, channelId, token);
         console.log("📌 서버 응답:", response.data);

         if (response.data && response.data._id) {
            alert("글이 성공적으로 작성되었습니다.");
            setTitle("");
            setContent("");
            setImage(null);
            setPreview(null);
            router.push(`/community/post/${response.data._id}`);
         } else {
            throw new Error("게시글 ID를 찾을 수 없습니다.");
         }
      } catch (error) {
         const axiosError = error as AxiosError;
         console.error("❌ 오류:", axiosError);
         alert(axiosError.response?.data?.message || axiosError.message || "게시글 작성 중 오류가 발생했습니다.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen flex flex-col">
         <Header />
         <div className="relative">
            <Image
               width={0}
               height={0}
               sizes="100vw"
               src="/images/community/banner.png"
               alt="banner"
               className="w-full h-[160px] object-cover"
            />
            <div className="absolute top-1/2 left-12 transform -translate-y-1/2 text-white text-left">
               <p className="text-[28px] font-medium">설레는 동행과 특별한 이야기가 머무는 곳</p>
               <h2 className="text-[36px] font-semibold mt-2">동행 모집 작성</h2>
            </div>
         </div>
         <div className="max-w-[800px] w-full mx-auto mt-16 p-6 bg-white shadow-lg rounded-lg mb-16">
            <button onClick={() => router.back()} className="mb-4 text-blue-500 hover:underline">
               ◀ 게시글 목록
            </button>
            <div className="mb-4">
               <label className="block text-lg font-semibold">제목 *</label>
               <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
               />
            </div>
            <div className="mb-4">
               <label className="block text-lg font-semibold">내용 *</label>
               <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md h-40"
                  required
               />
            </div>
            <div className="mb-4">
               <label className="block text-lg font-semibold">사진 첨부 (선택)</label>
               <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border border-gray-300 rounded-md"
               />
               {preview && <Image src={preview} alt="미리보기" className="mt-2 w-full h-48 object-cover rounded-md" />}
            </div>
            <button
               onClick={handleSubmit}
               disabled={!title || !content || loading}
               className={`w-full p-4 text-lg font-semibold rounded-md ${
                  loading ? "bg-gray-300 cursor-not-allowed" : "bg-sky-500 text-white"
               }`}>
               {loading ? "작성 중..." : "작성 완료"}
            </button>
         </div>
         <Footer />
      </div>
   );
}
