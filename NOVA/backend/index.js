import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"



const app = express()
const allowedOrigins = [
    process.env.ALLOWED_ORIGIN,          // e.g. https://nova-frontend.vercel.app
    /^http:\/\/localhost:\d+$/,          // any localhost port for local dev
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true) // Postman / server-to-server
        const allowed = allowedOrigins.some((o) =>
            typeof o === "string" ? o === origin : o.test(origin)
        )
        if (allowed) {
            callback(null, true)
        } else {
            callback(new Error(`CORS blocked: ${origin}`))
        }
    },
    credentials: true
}))
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)


app.listen(port, () => {
    connectDb()
    console.log("server started")
})

