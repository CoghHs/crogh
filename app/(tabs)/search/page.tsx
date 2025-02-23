import { notFound } from "next/navigation";
import { getSearchResults } from "./actions";
import SearchResult from "@/components/search/SearchResult";

export default async function SearchResults({
  searchParams,
}: {
  searchParams: { keyword: string };
}) {
  const keyword = searchParams.keyword;
  if (!keyword) {
    notFound();
  }
  const results = await getSearchResults(keyword);
  return (
    <div className="p-4">
      <h1 className="text-2xl text-center font-bold mb-4">
        {keyword}{" "}
        <span className="text-gray-700 font-normal">검색한 결과입니다</span>
      </h1>
      <div>
        <SearchResult initialTweets={results} keyword={keyword} />
      </div>
    </div>
  );
}
