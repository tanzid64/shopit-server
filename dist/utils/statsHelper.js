export const calculatePercentage = (currentMonth, lastMonth) => {
    if (lastMonth === 0)
        return currentMonth * 100;
    const percent = ((currentMonth - lastMonth) / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
