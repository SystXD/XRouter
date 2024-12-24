import { XRouter } from "../structure/router";
import express from 'express'
import path from 'path'
const app = express()

new XRouter({
    dir: path.join(__dirname, 'Routes'), // The folder name must be "Routes",
    app,
    hooks: true
})

app.listen(3200, () => console.log("The API is Launched"))