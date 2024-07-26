import { nodeCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage, getInventories } from "../utils/statsHelper.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats;
  if (nodeCache.has("adminStats"))
    stats = JSON.parse(nodeCache.get("adminStats") as string);
  else {
    // Last date of current month
    const today = new Date();
    // six month ago
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6);
    // Start & End date of current month
    const currentMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };
    // Start & End date of last month
    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    // All Products of current month
    const currentMonthProductsPromise = Product.find({
      createdAt: {
        $gte: currentMonth.start,
        $lte: currentMonth.end,
      },
    });
    // All Products of last month
    const lastMonthProductsPromise = Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    // All users of current month
    const currentMonthUsersPromise = User.find({
      createdAt: {
        $gte: currentMonth.start,
        $lte: currentMonth.end,
      },
    });
    // All Users of last month
    const lastMonthUsersPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });
    // All orders of current month
    const currentMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: currentMonth.start,
        $lte: currentMonth.end,
      },
    });
    // All Orders of last month
    const lastMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });
    // All Orders of last 6 months
    const lastSixMonthsOrdersPromise = Order.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    });
    // Latest Transaction
    const latestTransactionPromise = Order.find()
      .sort({ createdAt: -1 })
      .select(["orderItems", "discount", "total", "status"])
      .limit(4);
    // Call all promises together
    const [
      currentMonthProducts,
      lastMonthProducts,
      currentMonthUsers,
      lastMonthUsers,
      currentMonthOrders,
      lastMonthOrders,
      productsCount,
      usersCount,
      allOrders,
      lastSixMonthsOrders,
      categories,
      maleUsersCount,
      latestTransaction,
    ] = await Promise.all([
      currentMonthProductsPromise,
      lastMonthProductsPromise,
      currentMonthUsersPromise,
      lastMonthUsersPromise,
      currentMonthOrdersPromise,
      lastMonthOrdersPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find().select("total"),
      lastSixMonthsOrdersPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "male" }),
      latestTransactionPromise,
    ]);
    // Revenue calculation
    const currentMonthRevenue = currentMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );
    const lastMonthRevenue = lastMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );
    // Calculate percentage change
    const changePercentage = {
      revenue: calculatePercentage(currentMonthRevenue, lastMonthRevenue),
      product: calculatePercentage(
        currentMonthProducts.length,
        lastMonthProducts.length
      ),
      user: calculatePercentage(
        currentMonthUsers.length,
        lastMonthUsers.length
      ),
      order: calculatePercentage(
        currentMonthOrders.length,
        lastMonthOrders.length
      ),
    };
    // Total orders
    const revenue = allOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );
    // All counts
    const counts = {
      revenue,
      products: productsCount,
      users: usersCount,
      orders: allOrders.length,
    };
    // Revenue chart data
    const orderMonthCounts = new Array(6).fill(0);
    const orderMonthlyRevenue = new Array(6).fill(0);

    lastSixMonthsOrders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = today.getMonth() - creationDate.getMonth();
      if (monthDiff < 6) {
        orderMonthCounts[6 - monthDiff - 1] += 1;
        orderMonthlyRevenue[6 - monthDiff - 1] += order.total;
      }
    });

    // inventory
    const categoryCount = await getInventories({
      categories,
      productsCount,
    });

    // User Ratio
    const userRatio = {
      male: maleUsersCount,
      female: usersCount - maleUsersCount,
    };

    // Modify Latest transaction
    const modifiedLatestTransaction = latestTransaction.map((transaction) => {
      return {
        _id: transaction._id,
        total: transaction.total,
        discount: transaction.discount,
        quantity: transaction.orderItems.length,
        status: transaction.status,
      };
    });

    // save in cache
    stats = {
      changePercentage,
      counts,
      chart: {
        order: orderMonthCounts,
        revenue: orderMonthlyRevenue,
      },
      categoryCount,
      userRatio,
      latestTransaction: modifiedLatestTransaction,
    };
    nodeCache.set("adminStats", JSON.stringify(stats));
  }

  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getPieCharts = TryCatch(async (req, res, next) => {
  let charts;
  if (nodeCache.has("adminPieCharts"))
    charts = JSON.parse(nodeCache.get("adminPieCharts") as string);
  else {
    const allOrdersPromise = Order.find().select([
      "total",
      "discount",
      "subtotal",
      "tax",
      "shippingCharges",
    ]);
    const [
      processingOrder,
      shippedOrder,
      deliveredOrder,
      categories,
      productsCount,
      productOutOfStock,
      allOrders,
      allUsers,
      adminUsersCount,
      customerUsersCount,
    ] = await Promise.all([
      Order.countDocuments({ status: "processing" }),
      Order.countDocuments({ status: "out for delivery" }),
      Order.countDocuments({ status: "delivered" }),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      allOrdersPromise,
      User.find().select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);
    const orderFullFillment = {
      processing: processingOrder,
      shipped: shippedOrder,
      delivered: deliveredOrder,
    };
    // Product categories Ratio
    const producCategories = await getInventories({
      categories,
      productsCount,
    });
    // Stock availability
    const stockAvailability = {
      inStock: productsCount - productOutOfStock,
      outOfStock: productOutOfStock,
    };
    // Revenue Distribution
    const grossIncome = allOrders.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );
    const discount = allOrders.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );
    const productionCost = allOrders.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );
    const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
    const marketingCost = Math.round(grossIncome * (30 / 100));
    const netMargin =
      grossIncome - discount - productionCost - burnt - marketingCost;
    const revenueDistribution = {
      netMargin,
      discount,
      productionCost,
      burnt,
      marketingCost,
    };
    // User age group
    const usersAgeGroup = {
      teen: allUsers.filter((i) => i.age < 20).length,
      adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
      old: allUsers.filter((i) => i.age >= 40).length,
    };
    const adminCustomer = {
      admin: adminUsersCount,
      customer: customerUsersCount,
    };

    charts = {
      orderFullFillment,
      producCategories,
      stockAvailability,
      revenueDistribution,
      usersAgeGroup,
      adminCustomer,
    };
    nodeCache.set("adminPieCharts", JSON.stringify(charts));
  }
  return res.status(200).json({
    success: true,
    charts,
  });
});

export const getBarCharts = TryCatch(async (req, res, next) => {});

export const getLineCharts = TryCatch(async (req, res, next) => {});
