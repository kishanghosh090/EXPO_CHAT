import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./lib/auth";
const app = express();
const PORT = 4005;
app.all("/api/auth/*", toNodeHandler(auth));
app.use(express.json());
app.get("/", (req, res) => {
    return res.status(200).json({ msg: "hello from chaiii code" });
});
app.listen(PORT, () => {
    console.log(`Server is listing at PORT ${PORT}`);
});
//# sourceMappingURL=index.js.map