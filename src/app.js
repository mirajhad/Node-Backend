import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "100kb"}))
app.use(express.urlencoded({extended: true, limit: "100kb"}))
app.use(express.static("public"))
app.use(cookieParser())



// routes import

import userRouter from './routes/user.routes.js'
import mailRouter from "./routes/email.routes.js"
import healthCheck from "./routes/health.routes.js"

//routes declarations
app.use("/", userRouter)
app.use("/api/v1/mails",mailRouter )
app.use("/",healthCheck)


export {app}