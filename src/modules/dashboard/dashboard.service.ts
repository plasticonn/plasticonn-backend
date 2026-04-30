import { Logger } from "../../common/logger/logger";
import { CenterModel } from "../centers/centers.model";
import { CollectorsModel } from "../collectors/collectors.model";
import { DropsModel } from "../drops/drops.model";

const log = new Logger("Dashboard service");

export const getDashboardStats = async () => {
  log.info("Getting dashboard stats");

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const safePercentage = (num: number, den: number) => {
    if (den === 0) return 0;
    return (num / den) * 100;
  };

  /* ================= HELPERS ================= */

  const sumPlastics = async (match: any) => {
    const res = await DropsModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    return res[0]?.total || 0;
  };

  /* ================= COUNTS ================= */

  const [
    totalUsers,
    totalCenters,

    thisMonthUsers,
    thisMonthCenters,

    lastMonthUsers,
    lastMonthCenters,

    totalDropOffs,
    thisMonthDropOffs,
    lastMonthDropOffs,
  ] = await Promise.all([
    CollectorsModel.countDocuments(),
    CenterModel.countDocuments({ status: "active", verified: true }),

    CollectorsModel.countDocuments({
      createdAt: { $gte: startOfThisMonth },
    }),
    CenterModel.countDocuments({
      status: "active",
      verified: true,
      createdAt: { $gte: startOfThisMonth },
    }),

    CollectorsModel.countDocuments({
      createdAt: {
        $gte: startOfLastMonth,
        $lt: startOfThisMonth,
      },
    }),
    CenterModel.countDocuments({
      status: "active",
      verified: true,
      createdAt: {
        $gte: startOfLastMonth,
        $lt: startOfThisMonth,
      },
    }),

    // 🔥 plastics totals instead of counts
    sumPlastics({ status: "accepted" }),

    sumPlastics({
      status: "accepted",
      createdAt: { $gte: startOfThisMonth },
    }),

    sumPlastics({
      status: "accepted",
      createdAt: {
        $gte: startOfLastMonth,
        $lt: startOfThisMonth,
      },
    }),
  ]);

  /* ================= CURRENT % GROWTH ================= */

  const currentPercentageGrowth = {
    users: safePercentage(thisMonthUsers, totalUsers - thisMonthUsers),
    centers: safePercentage(thisMonthCenters, totalCenters - thisMonthCenters),

    // now based on plastics volume
    dropOffs: safePercentage(
      thisMonthDropOffs,
      totalDropOffs - thisMonthDropOffs,
    ),

    overall: safePercentage(
      thisMonthUsers + thisMonthCenters + thisMonthDropOffs,
      totalUsers +
        totalCenters +
        totalDropOffs -
        (thisMonthUsers + thisMonthCenters + thisMonthDropOffs),
    ),
  };

  /* ================= MOM % DIFFERENCE ================= */

  const momPercentageDifference = {
    users: safePercentage(thisMonthUsers - lastMonthUsers, lastMonthUsers),
    centers: safePercentage(
      thisMonthCenters - lastMonthCenters,
      lastMonthCenters,
    ),

    // now based on plastics volume
    dropOffs: safePercentage(
      thisMonthDropOffs - lastMonthDropOffs,
      lastMonthDropOffs,
    ),

    overall: safePercentage(
      thisMonthUsers +
        thisMonthCenters +
        thisMonthDropOffs -
        (lastMonthUsers + lastMonthCenters + lastMonthDropOffs),
      lastMonthUsers + lastMonthCenters + lastMonthDropOffs,
    ),
  };

  return {
    users: totalUsers,
    centers: totalCenters,

    // now total plastics, not document count
    dropOffs: totalDropOffs,

    overall: Number(currentPercentageGrowth.overall.toFixed(1)),

    growth: {
      users: Number(momPercentageDifference.users.toFixed(1)),
      centers: Number(momPercentageDifference.centers.toFixed(1)),
      dropOffs: Number(momPercentageDifference.dropOffs.toFixed(1)),
      overall: Number(momPercentageDifference.overall.toFixed(1)),
    },
  };
};

export const yearlyPlasticCollection = async () => {
  log.info("Getting dashboard graph stats");

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

  const result = await DropsModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfYear,
          $lt: endOfYear,
        },
        status: "accepted",
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        total: { $sum: "$amount" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const monthlyTotals = Array(12).fill(0);

  result.forEach((item) => {
    monthlyTotals[item._id - 1] = item.total;
  });

  return {
    year: now.getFullYear(),
    data: monthlyTotals,
  };
};

export const getAnalyticsStats = async () => {
  const CO2_PER_KG = 2.5;

  const result = await DropsModel.aggregate([
    {
      $match: {
        status: "accepted",
      },
    },
    {
      $group: {
        _id: null,
        totalPlastic: { $sum: "$amount" },
        totalDrops: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        totalPlastic: 1,
        totalDrops: 1,
        efficiency: {
          $cond: [
            { $eq: ["$totalDrops", 0] },
            0,
            {
              $round: [{ $divide: ["$totalPlastic", "$totalDrops"] }, 2],
            },
          ],
        },
        co2Saved: {
          $round: [{ $multiply: ["$totalPlastic", CO2_PER_KG] }, 2],
        },
      },
    },
  ]);

  return (
    result[0] || {
      totalPlastic: 0,
      totalDrops: 0,
      efficiency: 0,
      co2Saved: 0,
    }
  );
};
