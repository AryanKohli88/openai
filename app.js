import express from 'express'
import axios from 'axios'
import { createClient } from 'redis'

const app = express()
const client = createClient()
client.on('error', err => console.log('Redis Client Error', err));

await client.connect();


app.get("/", async (req, res)=>{

    const cachevalue = await client.get("todos") // lookup if cache is available
    if(cachevalue) 
    {
        console.log("cache exists"); return res.json(JSON.parse(cachevalue))
    }
    else 
    {
        console.log("No cache found")
    }
    
    const {data} = await axios.get('https://jsonplaceholder.typicode.com/todos/');
    await client.set("todos", JSON.stringify(data)) // storing cache
    await client.expire("todos", 30) // set expire time for cache

    return res.json(data)

})

app.listen(9000)