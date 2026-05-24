import mongoose from "mongoose";
import { Logger } from "../../common/logger/logger";
import { DropsModel } from "../drops/drops.model";

const log = new Logger("leaderboard service");

const getTopCollectors = async () => {
  log.info("Getting top collectors leaderboard");

  const leaderboard = await DropsModel.aggregate([
    {
      $match: {
        status: "accepted",
      },
    },
    {
      $group: {
        _id: "$collector_id",
        totalPlastics: {
          $sum: "$amount",
        },
      },
    },
    {
      $sort: {
        totalPlastics: -1,
      },
    },
    {
      $limit: 20,
    },
    {
      $lookup: {
        from: "collectors",
        localField: "_id",
        foreignField: "_id",
        as: "collector",
      },
    },
    {
      $unwind: "$collector",
    },
    {
      $project: {
        _id: 1,
        totalPlastics: 1,
        collector: "$collector",
        // name: "$collector.name",
        // image: {
        //   $ifNull: ["$collector.image.url", null],
        // },
        // email: "$collector.email",
      },
    },
  ]);

  const rankedLeaderboard = leaderboard.map((collector, index) => ({
    rank: index + 1,
    ...collector,
  }));

  return rankedLeaderboard;
};

const getCollectorRank = async (collectorId: string) => {
  const leaderboard = await DropsModel.aggregate([
    {
      $match: {
        status: "accepted",
      },
    },
    {
      $group: {
        _id: "$collector_id",
        totalPlastics: {
          $sum: "$amount",
        },
      },
    },
    {
      $setWindowFields: {
        sortBy: {
          totalPlastics: -1,
        },
        output: {
          rank: {
            $rank: {},
          },
        },
      },
    },
    {
      $match: {
        _id: new mongoose.Types.ObjectId(collectorId),
      },
    },
  ]);

  if (!leaderboard.length) {
    return {
      rank: null,
      totalPlastics: 0,
    };
  }

  return {
    rank: leaderboard[0].rank,
    totalPlastics: leaderboard[0].totalPlastics,
  };
};

export const LeaderboardService = { getCollectorRank, getTopCollectors };
