import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../../utils/backend/mangodb";
import FreeSwingAnalysisResult from "../../../../utils/backend/model/freeSwingAnalysisModel";
import SumRiskRewardFreeSwing from "../../../../utils/backend/model/sumRiskRewardFreeSwingModel";
import { getMonthName } from "../../../../utils/backend/common/commonHelpers";

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    const allFreeSwingAnalyses = await FreeSwingAnalysisResult.find();
    const totalSwingAnalysisCount =
      await FreeSwingAnalysisResult.countDocuments();

    // if (!allFreeSwingAnalyses || allFreeSwingAnalyses.length === 0) {
    //   throw new Error("No analyses found to calculate sum");
    // }

    const onlyBreakoutAnalyses = allFreeSwingAnalyses.filter(
      (analysis) => analysis.result.breakout !== "none"
    );

    const currentDate = new Date();

    const currentWeekStart = new Date(currentDate);
    currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
    const currentWeekEnd = new Date(currentDate);
    currentWeekEnd.setDate(
      currentWeekEnd.getDate() + (6 - currentWeekEnd.getDay())
    );
    currentWeekEnd.setHours(23, 59, 59, 999);

    const lastMonthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const lastMonthEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );
    lastMonthEnd.setDate(lastMonthEnd.getDate() + 1);

    const currentDayStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    const analysesLastMonth = allFreeSwingAnalyses.filter(
      (analysis) =>
        analysis.updatedAt >= lastMonthStart &&
        analysis.updatedAt < lastMonthEnd
    );

    const monthlyTotals = [];

    const firstDayOfCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    for (let i = 0; i < 5; i++) {
      const targetMonthStart = new Date(firstDayOfCurrentMonth);
      targetMonthStart.setMonth(targetMonthStart.getMonth() - i);

      const targetMonthEnd = new Date(
        targetMonthStart.getFullYear(),
        targetMonthStart.getMonth() + 1,
        0
      );
      targetMonthEnd.setDate(targetMonthEnd.getDate() + 1);

      const monthYearKey = {
        month: getMonthName(targetMonthStart.getMonth()),
        year: targetMonthStart.getFullYear(),
      };

      const monthlyTotal = {
        month: monthYearKey.month,
        year: monthYearKey.year,
        risk: 0,
        reward: 0,
      };

      const analysesForMonth = allFreeSwingAnalyses.filter(
        (analysis) =>
          analysis.updatedAt >= targetMonthStart &&
          analysis.updatedAt < targetMonthEnd
      );

      analysesForMonth.forEach((analysis) => {
        monthlyTotal.risk += analysis.result.risk;
        const reward = analysis.result.reward;

        const adjustedReward = reward === 0 ? -1 : reward;
        monthlyTotal.reward += adjustedReward;
      });

      monthlyTotals.push(monthlyTotal);
    }

    const reversedMonthlyTotals = monthlyTotals.reverse();

    const lastYearEnd = new Date(currentDate);
    lastYearEnd.setFullYear(currentDate.getFullYear() - 1);
    lastYearEnd.setMonth(11, 31);
    lastYearEnd.setHours(23, 59, 59, 999);

    const lastYearStart = new Date(lastYearEnd);
    lastYearStart.setMonth(0, 1);
    lastYearStart.setHours(0, 0, 0, 0);

    const analysesLastYear = allFreeSwingAnalyses.filter(
      (analysis) =>
        analysis.updatedAt >= lastYearStart && analysis.updatedAt <= lastYearEnd
    );

    const totalRiskLastYear =
      analysesLastYear.reduce(
        (sum, analysis) => sum + analysis.result.risk,
        0
      ) || 0;
    const totalRewardLastYear =
      analysesLastYear.reduce(
        (sum, analysis) => sum + analysis.result.reward,
        0
      ) || 0;

    const totalRiskLastMonth =
      analysesLastMonth.reduce(
        (sum, analysis) => sum + analysis.result.risk,
        0
      ) || 0;

    const totalRewardLastMonth =
      analysesLastMonth.reduce(
        (sum, analysis) => sum + analysis.result.reward,
        0
      ) || 0;

    const totalRisk = allFreeSwingAnalyses.reduce(
      (sum, analysis) => sum + analysis.result.risk,
      0
    );
    // const totalReward = allFreeSwingAnalyses.reduce(
    //   (sum, analysis) => sum + analysis.result.reward,
    //   0
    // );
    const totalReward = allFreeSwingAnalyses.reduce((sum, analysis) => {
      const reward = analysis.result.reward;
      // Set reward to -1 if it is 0
      const adjustedReward = reward === 0 ? -1 : reward;
      return sum + adjustedReward;
    }, 0);

    const lastFiveMonthsTotals = [];

    for (let i = 0; i < 5; i++) {
      const targetMonthStart = new Date(firstDayOfCurrentMonth);
      targetMonthStart.setMonth(targetMonthStart.getMonth() - i);

      const targetMonthEnd = new Date(
        targetMonthStart.getFullYear(),
        targetMonthStart.getMonth() + 1,
        0
      );
      targetMonthEnd.setDate(targetMonthEnd.getDate() + 1);

      const monthYearKey = {
        month: getMonthName(targetMonthStart.getMonth()),
        year: targetMonthStart.getFullYear(),
      };

      const lastFiveMonthsTotal = {
        month: monthYearKey.month,
        year: monthYearKey.year,
        risk: 0,
        reward: 0,
      };

      const analysesForMonth = allFreeSwingAnalyses.filter(
        (analysis) =>
          analysis.updatedAt >= targetMonthStart &&
          analysis.updatedAt < targetMonthEnd
      );

      analysesForMonth.forEach((analysis) => {
        lastFiveMonthsTotal.risk += analysis.result.risk;
        lastFiveMonthsTotal.reward += analysis.result.reward;
      });

      lastFiveMonthsTotals.push(lastFiveMonthsTotal);
    }

    const totalRiskLastFiveMonth = monthlyTotals.reduce(
      (sum, monthTotal) => sum + monthTotal.risk,
      0
    );

    const totalRewardLastFiveMonth = monthlyTotals.reduce(
      (sum, monthTotal) => sum + monthTotal.reward,
      0
    );

    const existingRecord = await SumRiskRewardFreeSwing.findOne();

    if (existingRecord) {
      existingRecord.totalRisk = totalRisk;
      existingRecord.totalReward = totalReward;
      await existingRecord.save();
    } else {
      const sumRiskRewardSwing = new SumRiskRewardFreeSwing({
        totalRisk: totalRisk,
        totalReward: totalReward,
      });
      await sumRiskRewardSwing.save();
    }

    res.status(200).json({
      totalRisk,
      totalReward,
      totalRiskLastMonth,
      totalRewardLastMonth,
      totalRiskLastFiveMonth,
      totalRewardLastFiveMonth,
      reversedMonthlyTotals,
      totalRiskLastYear,
      totalRewardLastYear,
      totalSwingAnalysisCount,
      onlyBreakoutAnalyses,
    });

    // await closeDatabaseConnection();
  } catch (error) {
    console.error("sum-risk-reward-free-swing error", error.message);
    res.status(500).json({ message: "Internal server error" });
    // await closeDatabaseConnection();
  }
}
