export function formatToTimeAgo(date: string): string {
  const dayInMs = 1000 * 60 * 60 * 24;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs);

  const formatter = new Intl.RelativeTimeFormat("ko");

  return formatter.format(diff, "days");
}

export const formatTime = (time: number | null) => {
  if (time === null) return "Unlimited";
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${formattedSeconds}`;
};
