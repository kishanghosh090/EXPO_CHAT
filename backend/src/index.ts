import express from "express";

const app = express();
const PORT = 4005;

app.get("/", (req, res) => {
  return res.status(200).json({ msg: "hello from chaiii code" });
});

app.listen(PORT, () => {
  console.log(`Server is listing at PORT ${PORT}`);
});
