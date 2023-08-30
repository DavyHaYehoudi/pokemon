const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const bodyParser = require("body-parser");
const Sequelize = require("./src/db/sequelize");
const app = express();
const port = 3000;

const pokemonRouter = require("./src/routes/pokemons.routes")
const userRouter = require("./src/routes/user.routes");
const errorHandler = require("./src/errors/errorHandler");

app.use(morgan("dev")).use(bodyParser.json());
Sequelize.initDb()

app.use("/api/pokemons",pokemonRouter)
app.use("/api/auth",userRouter)

// Gestion des erreurs 404
app.use(({res})=>{
  const message = "Impossible de trouver la ressource demandée. Vous pouvez essayer une autre URL"
  res.status(404).json({message})
})
app.use(errorHandler)
app.listen(port, () =>
  console.log(`Notre application est démarée sur : http://localhost:${port}`)
);

