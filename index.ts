import express, { ErrorRequestHandler, Express, NextFunction, Request, Response } from "express"
import { router } from "./routes/route"
import { PORT } from "./config"

const app = express()

app.use(express.json())
app.use(express.urlencoded());

app.use('/', router)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {

})

app.listen(PORT, () => {
    console.log(`Server listening to the port ${PORT}`)
})
