const express = require("express");
const {
  getAllPokemons,
  getOnePokemon,
  addOnePokemon,
  updateOnePokemon,
  deleteOnePokemon,
} = require("../controllers/pokemons.controller");
const { checkUser } = require("../controllers/checkUser");
const router = express.Router();

router.get("/", checkUser, getAllPokemons);
router.get("/:id", checkUser, getOnePokemon);
router.post("/", checkUser, addOnePokemon);
router.put("/:id", checkUser, updateOnePokemon);
router.delete("/:id", checkUser, deleteOnePokemon);

module.exports = router;
