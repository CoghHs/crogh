export default function Loading() {
  return (
    <div className="p-5 animate-pulse grid grid-cols-5 gap-5">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="rounded-md space-y-4">
          <div className="bg-neutral-700 h-28 w-full rounded-md" />
          <div className="flex flex-col gap-2 rounded-md">
            <div className="bg-neutral-700 h-5 w-40 rounded-md " />
            <div className="bg-neutral-700 h-5 w-20 rounded-md " />
            <div className="bg-neutral-700 h-5 w-10 rounded-md " />
          </div>
        </div>
      ))}
    </div>
  );
}
