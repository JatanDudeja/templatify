import dotenv from 'dotenv';
import connectDB from './db/index.js';
import app from './app.js';

dotenv.config({
    path: './.env'
})

const PORT = process.env.PORT || 3001;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`)
    })
    console.log("connectDB function ran everything is fine.")
})
.catch((err : Error) => {
    console.log("Error in running connectDB function.")
})