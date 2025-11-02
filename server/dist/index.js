"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const supabase_js_1 = require("@supabase/supabase-js");
const port = 3000;
// connect to SupaBase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
console.log(supabaseUrl);
console.log(supabaseKey);
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Welcome message endpoint
app.get("/api", (req, res) => {
    res.status(200).send("Hello from the api!");
});
// Get all users
app.get("/api/users", async (req, res) => {
    const { data, error } = await supabase.from("Users").select("*");
    if (error) {
        console.log(`get users error: ${error.message}. Details: ${error.details}`);
        return res.status(500).send();
    }
    res.status(200).send(data);
});
// get specific user
app.get("api/users/:username", async (req, res) => {
    const { data, error } = await supabase.from("Users").select("*").eq("username", req.params.username);
    if (error) {
        console.log(`get specific user search error ${error}`);
        res.status(500).send();
    }
    res.status(200).send(data);
});
// create new user
app.post("/api/users", async (req, res) => {
    const reqJSON = req.body;
    console.log(reqJSON);
    const { data, error } = await supabase.from("Users").insert(req.body);
    if (error) {
        console.log(`post to users error: ${error}`);
        res.status(500).send();
        return;
    }
    res.status(200).send();
});
// update user
app.put("/api/users/:username", async (req, res) => {
    const body = req.body;
    console.log(`put request with body ${body}`);
    const { data, error } = await supabase.from("Users").update(body).eq("username", req.params.username);
    // console.log("returned from supabase")
    if (error) {
        console.log(`put to users error: ${error}`);
        res.status(500).send();
        return;
    }
    res.status(200).send();
});
// delete a user
app.delete("/api/users/:username", async (req, res) => {
    const { data, error } = await supabase.from("Users").delete().eq("username", req.params.username);
    if (error) {
        console.log(`error with deleting user: ${error}`);
        res.status(500).send();
        return;
    }
    res.status(200).send();
});
app.listen(3000, "0.0.0.0", () => console.log(`Backend Listening on port ${port}`));
