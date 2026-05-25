import { CenterModel } from "../centers/centers.model";
import { CollectorsModel } from "../collectors/collectors.model";
import { DropsModel } from "../drops/drops.model";

export const websiteData = async () => {
  const now = new Date();
  const currentYear = now.getFullYear();

  // ── Parallel queries ──────────────────────────────────────────────
  const [
    activeCollectors,
    totalCollectionCenters,
    totalRecyclingCenters,
    allDrops,
    monthlyTrend,
  ] = await Promise.all([
    // Hero
    CollectorsModel.countDocuments({ status: "active" }),

    CenterModel.countDocuments({ centerType: "collection", status: "active" }),

    CenterModel.countDocuments({ centerType: "recycling", status: "active" }),

    // All drops (used across multiple sections)
    DropsModel.find(
      {},
      { amount: 1, status: 1, collector_id: 1, center_id: 1, createdAt: 1 },
    ).lean(),

    // Monthly trend for current year
    DropsModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  // ── Derived stats ─────────────────────────────────────────────────
  const totalPlasticsCollected = allDrops.reduce(
    (sum, d) => sum + (d.amount ?? 0),
    0,
  );

  const recycledDrops = allDrops.filter((d) => d.status === "recycled");
  const totalRecycled = recycledDrops.reduce(
    (sum, d) => sum + (d.amount ?? 0),
    0,
  );

  const percentRecycled =
    totalPlasticsCollected > 0
      ? Math.round((totalRecycled / totalPlasticsCollected) * 100)
      : 0;

  // Unique active participants (collectors + centers referenced in drops)
  const uniqueCollectorIds = new Set(
    allDrops.map((d) => d.collector_id?.toString()).filter(Boolean),
  );

  const uniqueCenterIds = new Set(
    allDrops.map((d) => d.center_id?.toString()).filter(Boolean),
  );

  const activeParticipants = uniqueCollectorIds.size + uniqueCenterIds.size;

  // Avg plastics collected per month (based on months that have data)
  const monthsWithData = new Set(
    allDrops.map((d) => {
      const date = new Date(d.createdAt);
      return `${date.getFullYear()}-${date.getMonth()}`;
    }),
  );

  const avgPerMonth =
    monthsWithData.size > 0
      ? Math.round(totalPlasticsCollected / monthsWithData.size)
      : 0;

  // CO2 saved — industry estimate: 1kg plastic = ~1.5kg CO2 saved vs incineration
  const co2Saved = +(totalRecycled * 1.5).toFixed(2);

  // Build full 12-month trend (fill missing months with 0)
  const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const trendMap = new Map(monthlyTrend.map((m) => [m._id, m.totalAmount]));

  const monthlyCollectionTrend = MONTH_NAMES.map((month, i) => ({
    month,
    amount: trendMap.get(i + 1) ?? 0,
  }));

  return {
    hero: {
      activeCollectors,
      totalCollectionCenters,
      totalRecyclingCenters,
      percentRecycled,
      avgPlasticsPerMonth: avgPerMonth,
    },
    impact: {
      totalPlasticsCollected,
      successfullyRecycled: totalRecycled,
      activeParticipants,
      co2EmissionsSaved: co2Saved,
      monthlyCollectionTrend,
    },
    solution: {
      plasticsRecycled: totalRecycled,
      totalActiveUsers: activeParticipants,
    },
  };
};

export const Website = {
  websiteData,
};
