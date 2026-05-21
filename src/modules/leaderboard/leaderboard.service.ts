import mongoose from "mongoose";
import { Logger } from "../../common/logger/logger";
import { DropsModel } from "../drops/drops.model";

const log = new Logger("leaderboard service");

const getTopCollectors = async () => {
  log.info("Getting top collectors leaderboard");

  const leaderboard = await DropsModel.aggregate([
    // only accepted drops
    {
      $match: {
        status: "accepted",
      },
    },

    // group by collector and sum plastics
    {
      $group: {
        _id: "$collector",
        totalPlastics: {
          $sum: "$amount",
        },
      },
    },

    // highest first
    {
      $sort: {
        totalPlastics: -1,
      },
    },

    // top 20
    {
      $limit: 20,
    },

    // join collector data
    {
      $lookup: {
        from: "collectors",
        localField: "_id",
        foreignField: "_id",
        as: "collector",
      },
    },

    // flatten collector array
    {
      $unwind: "$collector",
    },

    // shape response
    {
      $project: {
        _id: 1,

        totalPlastics: 1,

        name: "$collector.name",

        image: "$collector.image",

        email: "$collector.email",
      },
    },
  ]);

  // add ranking
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
        _id: "$collector",
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
