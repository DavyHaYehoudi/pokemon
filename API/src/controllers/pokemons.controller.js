const { ValidationError, UniqueConstraintError, Op } = require("sequelize");
const { Pokemon } = require("../db/sequelize");
const { PokemonError } = require("../errors/customError");

module.exports.getAllPokemons = async (req, res) => {
  try {
    if (req.query.name) {
      const name = req.query.name;
      if (name.length < 2) {
        const message =
          "The search term must contain at least 2 characters.";
        res.status(400).json({ message });
      } else {
        const limit = parseInt(req.query.limit) || 5;
        const { count, rows } = await Pokemon.findAndCountAll({
          where: { name: { [Op.like]: `%${name}%` } },
          limit: limit,
          order: ["name"],
        });
        const message = `There are ${count} pokemons that match the search term ${name} `;
        res.json({ message, data: rows });
      }
    } else {
      const pokemons = await Pokemon.findAll({ order: ["name"] });
      res.json(pokemons);
    }
  } catch (error) {
    const message =
      "The pokemon list could not be retrieved. Try again in a few moments.";
    res.status(500).json({ message, error });
  }
};
module.exports.getOnePokemon = async (req, res, next) => {
  const id = req.params.id;

  try {
    const pokemon = await Pokemon.findByPk(id);
    if (pokemon === null) {
      throw new PokemonError("This pokemon does not exist !", 0);
    }
    res.status(200).json(pokemon);
  } catch (error) {
    next(error);
  }
};
module.exports.addOnePokemon = async (req, res) => {
  try {
    const pokemon = await Pokemon.create(req.body);
    res.status(201).json(pokemon);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, error });
    }
    if (error instanceof UniqueConstraintError) {
      return res.status(400).json({ message: error.message, error });
    }
    const message =
      "Could not add pokemon. Try again in a few moments.";
    res.status(500).json({ message, error });
  }
};
module.exports.updateOnePokemon = async (req, res, next) => {
  let id = req.params.id;

  try {
    const pokemon = await Pokemon.findByPk(id);
    if (pokemon === null) {
      throw new PokemonError("This pokemon does not exist !", 0);
    }
    await Pokemon.update(req.body, { where: { id } });
    const newPokemon = await Pokemon.findByPk(id);
    res.status(200).json(newPokemon);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, error });
    }
    if (error instanceof UniqueConstraintError) {
      return res.status(400).json({ message: error.message, error });
    }
    next(error);
  }
};
module.exports.deleteOnePokemon = async (req, res, next) => {
  let id = req.params.id;
  try {
    const pokemonBeforeDelete = await Pokemon.findByPk(id);
    if (pokemonBeforeDelete === null) {
      throw new PokemonError("This pokemon does not exist !", 0);
    }
    await Pokemon.destroy({
      where: {
        id,
      },
    });
    res.status(200).json(pokemonBeforeDelete);
  } catch (error) {
    next(error);
  }
};
