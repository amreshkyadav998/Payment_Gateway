import connectToMongo from './database/db.js';
import express from 'express';
import cors from 'cors';
import payment from './routes/payment.js';

    
connectToMongo();
const app = express()
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

    
app.get('/', (req, res) => {
    res.send("Let's get start the backend one")
})

app.use('/api/payment', payment);
    
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})