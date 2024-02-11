const mongoose = require("mongoose");

const sumRiskRewardSwingSchema = new mongoose.Schema({
  totalRisk: { type: Number, default: 0 },
  totalReward: { type: Number, default: 0 },
});

const SumRiskRewardSwing =
  mongoose.models.SumRiskRewardSwing ||
  mongoose.model("SumRiskRewardSwing", sumRiskRewardSwingSchema);

module.exports = SumRiskRewardSwing;
