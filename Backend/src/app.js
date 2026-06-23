require('dotenv').config();
console.log('DB URL:', process.env.DATABASE_URL ? 'loaded' : 'MISSING')
const express = require('express')
const cors = require('cors');
const productRoutes = require('./routes/products')

const app = express();

app.use(express.json());
app.use(cors())


app.use('/api/products', productRoutes )

app.get('/health', (req,res)=>{
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(), 
        timestamp: Date.now()
    })
})


app.listen(process.env.PORT || 3000, (req,res)=>{
    console.log("Server is running!")
})


