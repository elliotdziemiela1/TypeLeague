import express from "express";
import type { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const port = 3000;

interface UserData {
    username : string,
    TypeScore : number
}


const supabaseUrl = "https://ajuclqklugoxuutnfvrp.supabase.co"
const supabaseKey = "sb_secret_Gv5kftQF0gmgww-wHzwcsw_rKfVyThS"
const supabase = createClient(supabaseUrl, supabaseKey)

const app = express();

app.use(express.json());

app.get("/api", (req : Request, res : Response) => {
    res.status(200).send("Hello from the api!");
})

app.get("/api/users", async (req : Request, res : Response) =>{
    const { data, error } = await supabase.from("Users").select("*");
    
    if (error) {
        console.log(`get users error: ${error}`);
        return res.status(500).send();
    }

    res.status(200).json(data);
})

app.post("/api/users", async (req : Request, res : Response) => {
    const reqJSON = req.body;
    console.log(reqJSON);
    
    const { data, error } = await supabase.from("Users").insert(req.body);

    if (error){
        console.log(`post to users error: ${error}`);
        res.status(500).send();
        return;
    }

    res.status(200).send();
})

app.put("/api/users", async (req, res) => {
    const body = req.body as UserData;
    console.log(`put request with body ${body}`);

    const { username, ...updates } = body;

    const { data, error } = await supabase.from("Users").update(updates).eq("username", username);
    console.log("returned from supabase")

    if (error){
        console.log(`put to users error: ${error}`)
        res.status(500).send();
        return

    }

    res.status(200).send();
})

app.delete("/api/users", async (req, res) => {
    const body = req.body as {username: string};

    const { data, error } = await supabase.from("Users").delete().eq("username",body.username);

    if (error){
        console.log(`error with deleting user: ${error}`);
        res.status(500).send();
        return;
    }

    res.status(200).send();
})



app.listen(3000, "0.0.0.0", () => console.log(`Backend Listening on port ${port}`));