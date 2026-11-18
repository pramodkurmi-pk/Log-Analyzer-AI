import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.use("/api", routes);

app.get("/", (req, res) => {
    res.send("Hello, Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});