require('dotenv').config();
const {Pool} = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

const CATEGORIES = [
    "Electronics",
    "Clothing",
    "Books",
    "Home & Kitchen",
    "Sports",
    "Beauty",
    "Toys",
    "Automotive",
    "Grocery",
    "Office Supplies",
];

const TOTAL = 200_000;
const BATCH_SIZE = 5_000;

function randomProduct(index){

    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const price = parseFloat((Math.random() * 9990 + 10).toFixed(2));
    const twoYearsAgo = Date.now() - (2 * 365 * 24 * 60 * 60 * 1000)

    const createdAt = new Date(twoYearsAgo + Math.random() * (2 * 365 * 24 * 60 * 60 * 1000))

    return {
        name :`Product ${index + 1}`,
        category,
        price,
        createdAt,
        updatedAt: createdAt
    };
};

async function seed(){
    console.log("Connected. Starting seed...")

    const batches = Math.ceil(TOTAL / BATCH_SIZE)

    for(let i = 0; i<batches; i++){
        const batch = [];

        for (let j = 0; j < BATCH_SIZE; j++) {
            const index = i * BATCH_SIZE + j  
            batch.push(randomProduct(index))
        }

        const names = batch.map(p => p.name);
        const categories = batch.map(p => p.category);
        const prices = batch.map(p => p.price);
        const createdAts = batch.map(p => p.createdAt);
        const updatedAts = batch.map(p => p.updatedAt);

        await pool.query(`
            INSERT INTO products (name, category , price , created_at , updated_at)
            SELECT * FROM unnest($1::text[], $2::text[], $3::numeric[], $4::timestamp[], $5::timestamp[])`
            , [names, categories, prices, createdAts, updatedAts])

        console.log(`Inserted ${(i + 1) * BATCH_SIZE} / ${TOTAL}`)    
    }

    await pool.end()
    console.log("Seed Complete.")
}

seed().catch((err) => {
    console.error(err)
    process.exit(1)
  })


