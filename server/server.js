import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: "../.env" });

const { Pool } = pg;
const app = express();
const PORT = process.env.EXPRESSPORT;

app.use(express.json());
app.use(cors())
app.use(logger);

let dbURL = process.env.DATABASE_URL

let db = new Pool({
  connectionString: dbURL
});


app.use(express.json())
app.use(logger)

// Routes
// Post todo

app.post('/todo', async (req, res) => {
  try {
    let { task } = req.body
    let newData = await db.query("INSERT INTO todo (task) VALUES($1) RETURNING *", [task]);
    res.status(200).json(newData.rows)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Failed post')
  }
})

// Get all todo

app.get('/todo', async (req, res) => {
  try {
    let data = await db.query("SELECT * FROM todo;")
    res.status(200).json(data.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send("Failed GET request")
  }
})

// get a todo

app.get("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await db.query("SELECT * FROM todo WHERE todo_id = $1", [id])
    res.status(200).json(todo.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send("Failed GET request")
  }
})

// Update a todo

app.put("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { task } = req.body;
    const update = await db.query("UPDATE todo SET task = $1 WHERE todo_id = $2", [task, id])
    res.status(200).json("Update successfull")
  } catch (err) {
    console.error(err)
    res.status(500).send("Failed PUT request")
  }
})

// Delete a todo

app.delete('/todo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await db.query("DELETE FROM todo WHERE todo_id = $1", [id]);
    res.status(200).json("Delete was successfull")
  } catch (err) {
    console.error(err)
    res.status(500).send("Failed DELETE request")
  }
})


function logger(req, res, next) {
  console.log("The request method was: ", req.method);
  console.log("The request URL was: ", req.url);
  next()
}

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
});