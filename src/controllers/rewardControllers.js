import Reward from "../database/models/rewardModel.js";

export const fetchRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.status(200).send({
      success: true,
      message: "Reward fetched successfully",
      data: rewards,
    });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

export const createdReward = async (req, res) => {
  const { image, rewardType, coinsRequired, rewardValue, status, title } =
    req.body;
  try {
    const reward = new Reward({
      title,
      image,
      rewardType,
      coinsRequired: parseInt(coinsRequired),
      rewardValue: parseInt(rewardValue),
      status,
    });
    await reward.save();
    if (reward) {
      res.status(201).send({
        success: true,
        message: "New reward created successfully",
        data: reward,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Bad Request! cannot create new reward at this moment",
      });
    }
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

export const editReward = async (req, res) => {
  const { rewardId, newData } = req.body;
  try {
    const reward = await Reward.findOneAndUpdate(
      { _id: rewardId },
      {
        $set: newData,
      },
      { new: true }
    );
    if (reward.acknowledged) {
      res.status(200).send({
        success: true,
        message: "Reward edited successfully",
        data: reward,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Bad Request! cannot edit reward at this moment",
      });
    }
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

export const deleteReward = async (req, res) => {
  const { rewardId } = req.query;
  try {
    const reward = await Reward.deleteOne({ _id: rewardId });
    if (reward.acknowledged) {
      res
        .status(200)
        .send({ success: true, message: "Reward deleted successfully" });
    } else {
      res.status(400).send({
        success: false,
        message: "Bad Request! cannot delete reward at this moment",
      });
    }
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};
