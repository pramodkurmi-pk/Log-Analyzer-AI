import express from "express";
import logAnalysis from "../utils/logAnalysis.js";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const logData = req.body;
    // console.log(req.body);

    if (!logData) {
      return res.status(400).json({ error: "log data is empty/invalid" });
    }

    const result = await logAnalysis(logData);

    if (!result || Object.keys(result).length === 0) {
      return res.status(500).json({ error: "Service Unavailable" });
    }

    res.json(result);
    // Or if you prefer keeping it wrapped: res.json({ result: jsonObject });

    // return res.json({ result });
  } catch (error) {
    return res.status(500).json({ error: "Internal Error" });
  }
});

export default router;
