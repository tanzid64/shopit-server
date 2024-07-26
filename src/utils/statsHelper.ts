import { Document } from "mongoose";
import { Product } from "../models/product.js";

export const calculatePercentage = (
  currentMonth: number,
  lastMonth: number
) => {
  if (lastMonth === 0) return currentMonth * 100;
  const percent = (currentMonth / lastMonth) * 100;
  return Number(percent.toFixed(0));
};

export const getInventories = async ({
  categories,
  productsCount,
}: {
  categories: string[];
  productsCount: number;
}) => {
  const categoryCountPromise = categories.map((category) => {
    Product.countDocuments({ category });
  });
  const categoriesCount = await Promise.all(categoryCountPromise);
  const categoryCount: Record<string, number>[] = [];
  categories.forEach((category, index) => {
    categoryCount.push({
      [category]: Math.round(
        (Number(categoriesCount[index]) / productsCount) * 100
      ),
    });
  });
  return categoryCount;
};

interface MyDocument extends Document {
  createdAt: Date;
}

type funcProps = {
  length: number;
  docArr: MyDocument[];
};

export const getChartData = ({ length, docArr }: funcProps) => {
  const data = new Array(length).fill(0);
  const today = new Date();
  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
    if (monthDiff < length) {
      data[length - monthDiff - 1] += 1;
    }
  });
  return data;
};
