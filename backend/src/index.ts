import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./lib/auth";

const app = express();
const PORT = 4005;

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

// routes
import friendRouter from "./modules/friend/friend.routes";

app.use("/api/v1/friend", friendRouter);


app.get("/", (req, res) => {
  return res.status(200).json({ msg: "hello from chaiii code" });
});

app.listen(PORT, () => {
  console.log(`Server is listening at PORT ${PORT}`);
});
