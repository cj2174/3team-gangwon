"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Post } from "../../../app/community/page"; // 부모에서 전달할 Post 타입

interface PostCardProps {
   post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
   const router = useRouter();
   const postStatus = parseTitle(post.title);
   const postTitle = getTitle(post.title);

   return (
      <div
         onClick={() => router.push(`/community/post/${post._id}`)}
         className="w-full px-6 py-5 flex flex-col bg-white rounded-3xl shadow-lg border border-neutral-300 hover:border-blue-500 cursor-pointer mx-auto hover:translate-y-[-4px] transition-all duration-300 ease-in-out">
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
         <p className="text-gray-500 text-sm">작성일 {new Date(post.createdAt).toLocaleDateString()}</p>
         <p className="text-gray-700 text-sm line-clamp-2">{post.content}</p>
         {postStatus && (
            <div className="flex justify-end mt-auto">
               <button
                  className={`py-2 px-6 rounded-md text-md font-semibold ${
                     postStatus === "모집중"
                        ? "bg-sky-100 text-sky-600 hover:bg-sky-200 outline outline-1 outline-sky-400"
                        : postStatus === "모집마감"
                        ? "bg-neutral-300 text-neutral-600 outline outline-1 outline-neutral-500 cursor-not-allowed"
                        : "bg-gray-200 text-gray-500"
                  }`}>
                  {postStatus}
               </button>
            </div>
         )}
      </div>
   );
};

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

// title에서 실제 제목을 추출하는 함수
const getTitle = (title: string) => {
   try {
      const parsed = JSON.parse(title); // title을 파싱하여 JSON 객체로 변환
      return parsed.title; // 실제 제목만 리턴
   } catch (error) {
      console.error("Error parsing title:", error);
      return "제목 없음"; // 파싱 실패 시 기본값
   }
};

export default PostCard;
