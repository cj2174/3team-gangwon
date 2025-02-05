"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { getPostsByChannel } from "@/utils/postapi";
import { AxiosResponse } from "axios";

interface Post {
   _id: string;
   title: string; // title은 실제 텍스트
   image?: string;
   content: string;
   createdAt: string;
   status: string; // 모집 상태 (모집중, 모집마감)
   endDate: string; // 마감일
}

export default function Community() {
   const router = useRouter();
   const [posts, setPosts] = useState<Post[]>([]);
   const [loadingPosts, setLoadingPosts] = useState(false);
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const postsPerPage = 9;
   const channelId = "679f3aba7cd28d7700f70f40";

   useEffect(() => {
      const fetchPosts = async () => {
         setLoadingPosts(true);
         try {
            const response: AxiosResponse<Post[]> = await getPostsByChannel(channelId);
            const sortedPosts = response.data.sort((a, b) => {
               const statusA = parseTitle(a.title);
               const statusB = parseTitle(b.title);

               // "모집중" 상태가 먼저 오도록 정렬
               if (statusA === "모집중" && statusB !== "모집중") return -1;
               if (statusB === "모집중" && statusA !== "모집중") return 1;
               return 0;
            });

            setPosts(sortedPosts);
         } catch (error) {
            console.error("❌ 게시글 불러오기 실패:", error);
         } finally {
            setLoadingPosts(false);
         }
      };
      fetchPosts();

      const token = localStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
   }, []);

   // title에서 status만 추출하는 함수
   const parseTitle = (title: string) => {
      try {
         const parsed = JSON.parse(title); // title을 파싱하여 JSON 객체로 변환
         return parsed.status; // status 값만 리턴
      } catch (error) {
         console.error("Error parsing title:", error);
         return "정보 없음"; // 파싱 실패 시 기본값
      }
   };

   const getTitle = (title: string) => {
      try {
         const parsed = JSON.parse(title); // title을 파싱하여 JSON 객체로 변환
         return parsed.title; // 실제 제목만 리턴
      } catch (error) {
         console.error("Error parsing title:", error);
         return "제목 없음"; // 파싱 실패 시 기본값
      }
   };

   const indexOfLastPost = currentPage * postsPerPage;
   const indexOfFirstPost = indexOfLastPost - postsPerPage;
   const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
   const totalPages = Math.ceil(posts.length / postsPerPage);

   return (
      <div>
         <Header />
         <div className="min-h-[480px] py-20 bg-[url(/images/community/banner_together.png)] bg-cover bg-center">
            <div className="relative flex flex-col justify-center gap-10">
               <div className="text-white text-center">
                  <h2 className="font-bold mt-20 leading-loose">
                     <span className="text-4xl block mb-5">함께하는 여행, 특별한 동행</span>
                     <span className="text-5xl block">강원도 여행 동행 모집</span>
                  </h2>
               </div>
            </div>
         </div>

         <div className="max-w-[1280px] min-h-[700px] w-full mx-auto px-2 py-16 flex-1">
            {" "}
            <div className="flex justify-between items-center py-2 mb-16 px-4">
               <h3 className="text-[32px] font-semibold text-gray-800">🌟 여행 동행 모집 게시판</h3>{" "}
               {isLoggedIn && (
                  <button
                     onClick={() => router.push(`/community/write?channelId=${channelId}`)}
                     className="w-[180px] h-[50px] mx-4 bg-sky-500 hover:bg-sky-600 transition text-white text-[18px] font-semibold rounded-md shadow-md transform hover:translate-y-1">
                     ✏️ 동행 모집 글쓰기
                  </button>
               )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
               {" "}
               {loadingPosts ? (
                  <p className="text-gray-500 text-center col-span-3">게시글을 불러오는 중...</p>
               ) : currentPosts.length > 0 ? (
                  currentPosts.map((post, index) => {
                     const postStatus = parseTitle(post.title);
                     const postTitle = getTitle(post.title);
                     return (
                        <div
                           key={`${post._id}-${index}`}
                           onClick={() => router.push(`/community/post/${post._id}`)} // 카드 클릭 시 바로 상세 페이지로 이동
                           className="w-full max-w-[380px] px-6 flex flex-col bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition border border-gray-300 hover:border-sky-500 cursor-pointer mx-auto hover:translate-y-[-4px]">
                           {" "}
                           <div className="w-full h-[200px] relative mb-4">
                              <Image
                                 src={post.image || "/images/no_img.jpg"}
                                 alt={post.title}
                                 layout="fill"
                                 objectFit="cover"
                                 className="rounded-2xl"
                              />
                           </div>
                           <h3 className="text-xl font-bold text-gray-900 mb-1">{postTitle}</h3>
                           <p className="text-gray-500 text-sm">
                              작성일 {new Date(post.createdAt).toLocaleDateString()}
                           </p>
                           <p className="text-gray-700 text-sm line-clamp-2">{post.content}</p>
                           {postStatus && (
                              <div className="flex justify-end mt-auto">
                                 <button
                                    className={`py-1 px-5 rounded-md text-md font-semibold ${
                                       postStatus === "모집중"
                                          ? "bg-sky-50 text-sky-500 hover:bg-amber-50 outline outline-1 outline-sky-500"
                                          : postStatus === "모집마감"
                                          ? "bg-neutral-300 text-neutral-500 outline outline-1 outline-neutral-500 cursor-not-allowed"
                                          : "bg-gray-200 text-gray-500"
                                    }`}>
                                    {postStatus}
                                 </button>
                              </div>
                           )}
                        </div>
                     );
                  })
               ) : (
                  <div className="flex flex-col items-center justify-center col-span-3 my-auto">
                     <p className="text-gray-500 text-center mb-4">등록된 게시글이 없습니다.</p>
                  </div>
               )}
            </div>
            {totalPages > 1 && (
               <div className="flex justify-center mt-8 space-x-4">
                  {[...Array(totalPages)].map((_, i) => (
                     <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-lg ${
                           currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}>
                        {i + 1}
                     </button>
                  ))}
               </div>
            )}
         </div>
         <Footer />
      </div>
   );
}
