export const calculatePercentage = (
  currentMonth: number,
  lastMonth: number
) => {
  if (lastMonth === 0) return currentMonth * 100;
  const percent = ((currentMonth - lastMonth) / lastMonth) * 100;
  return Number(percent.toFixed(0));
};
