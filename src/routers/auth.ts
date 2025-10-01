import { Router } from "express";

const router = Router();

router.post("/api/auth/login", (req, res) => {
    res.send("login");
});

router.post("/api/auth/register", (req, res) => {
    res.send("register");
});

export default router;