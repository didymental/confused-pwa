export const getFormattedDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.toLocaleString("default", { day: "2-digit" });
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const time = day + " " + month + ", " + year;
  return time;
};
