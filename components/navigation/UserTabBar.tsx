"use client";
import { useState } from "react";
import FavoriteList from "../favorite/FavoriteList";
import UserArtworkList from "../artwork/UserArtworkList";

export default function UserTabBar({ user }: any) {
  const [activeTab, setActiveTab] = useState("tweets");

  return (
    <div className="mt-10 flex flex-col">
      <div className="tabs flex justify-center items-center space-x-12 font-medium">
        <button
          onClick={() => setActiveTab("tweets")}
          className={`px-4 py-2 border-b-2 ${
            activeTab === "tweets" ? "border-black" : "border-transparent"
          }`}
        >
          게시글
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`px-4 py-2 border-b-2 ${
            activeTab === "favorites" ? "border-black" : "border-transparent"
          }`}
        >
          좋아요
        </button>
      </div>

      <div className="mt-10">
        {activeTab === "tweets" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {user?.tweet?.map((tweet: any) => (
              <UserArtworkList key={tweet.id} user={user} {...tweet} />
            ))}
          </div>
        )}
        {activeTab === "favorites" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {user?.Favorite?.map((fav: any) => {
              return (
                <FavoriteList
                  username={user.username}
                  key={fav.id}
                  imageId={fav.imageId}
                  imageUrl={fav.imageUrl}
                  category={fav.category}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
