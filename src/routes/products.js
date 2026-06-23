const express = require("express");
const pool = require("../db");

const router = express.Router();
const PAGE_SIZE = 20;

router.get("/", async (req, res) => {
  try {
    const { cursor, category, limit } = req.query;

    const pageSize = Math.min(Math.max(parseInt(limit) || PAGE_SIZE, 1), 100);

    const conditions = [];
    const values = [];

    if (category) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }

    if (cursor) {
      const decoded = JSON.parse(
        Buffer.from(cursor, "base64").toString("utf8"),
      );

      values.push(decoded.createdAt);
      values.push(decoded.id);
      conditions.push(
        `(created_at, id) < ($${values.length - 1}, $${values.length})`,
      );
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query(
      `
            SELECT * FROM products
            ${whereClause}
            ORDER BY created_at DESC 
            LIMIT $${values.length + 1}`,
      [...values, pageSize + 1],
    );

    const hasNextPage = result.rows.length > pageSize;
    const items = hasNextPage ? result.rows.slice(0, pageSize) : result.rows;

    let nextCursor = null;
    if (hasNextPage) {
      const last = items[items.length - 1];
      nextCursor = Buffer.from(
        JSON.stringify({ createdAt: last.created_at, id: last.id }),
      ).toString("base64");
    }

    res.json({ data: items,
        pagination: {
            hasNextPage,
            nextCursor,
            pageSize: items.length
        } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/categories', async (req,res)=>{
    try{
        const result = await pool.query(`SELECT DISTINCT category FROM products ORDER BY category`)
        res.json({data : result.rows});
    }catch(err){
        res.status(500).json({ error: "Internal server error"});
    }
});


module.exports = router;
