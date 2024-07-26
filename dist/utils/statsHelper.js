var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Product } from "../models/product.js";
export const calculatePercentage = (currentMonth, lastMonth) => {
    if (lastMonth === 0)
        return currentMonth * 100;
    const percent = (currentMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
export const getInventories = (_a) => __awaiter(void 0, [_a], void 0, function* ({ categories, productsCount, }) {
    const categoryCountPromise = categories.map((category) => {
        Product.countDocuments({ category });
    });
    const categoriesCount = yield Promise.all(categoryCountPromise);
    const categoryCount = [];
    categories.forEach((category, index) => {
        categoryCount.push({
            [category]: Math.round((Number(categoriesCount[index]) / productsCount) * 100),
        });
    });
    return categoryCount;
});
export const getChartData = ({ length, docArr, property }) => {
    const data = new Array(length).fill(0);
    const today = new Date();
    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            data[length - monthDiff - 1] += property ? i[property] : 1;
        }
    });
    return data;
};
//# sourceMappingURL=statsHelper.js.map