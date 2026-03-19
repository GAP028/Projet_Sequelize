const Game = require("../models/gameModel");

const createOneGame = async (request, response) => {
  const { title, releaseYear, platform, description } = request.body;

  if (
    !title ||
    !releaseYear ||
    !platform ||
    !description ||
    typeof title !== "string" ||
    typeof platform !== "string" ||
    typeof description !== "string" ||
    typeof releaseYear !== "number"
  ) {
    return response.status(400).json({
      message: "Le corps de la requête doit contenir title, releaseYear, platform et description avec les bons types",
      error: true
    });
  }

  try {
    const newGame = await Game.create({
      title: title,
      releaseYear: releaseYear,
      platform: platform,
      description: description
    });

    response.status(201).json({
      message: "Le jeu a été créé",
      game: newGame
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Le jeu n'a pas pu être créé à cause du serveur",
      error: true
    });
  }
};

const getAllGames = async (request, response) => {
  try {
    const games = await Game.findAll();

    response.json({
      message: "Jeux trouvés",
      results: games
    });
  } catch (error) {
    response.status(500).json({
      message: "Erreur du serveur",
      error: true
    });
  }
};

const getOneGameById = async (request, response) => {
  const id = Number(request.params.id);

  if (!id || isNaN(id)) {
    return response.status(400).json({
      message: "L'id doit être de type numérique",
      error: true
    });
  }

  try {
    const game = await Game.findByPk(id);

    if (!game) {
      return response.status(404).json({
        message: "Il n'y a pas de jeu avec cet ID",
        error: true
      });
    }

    response.json({
      message: "Jeu trouvé",
      result: game
    });
  } catch (error) {
    response.status(500).json({
      message: "Erreur du serveur",
      error: true
    });
  }
};

const updateOneGameById = async (request, response) => {
  const id = Number(request.params.id);

  if (!id || isNaN(id)) {
    return response.status(400).json({
      message: "L'id doit être de type numérique",
      error: true
    });
  }

  const { title, releaseYear, platform, description } = request.body;

  if (
    (title !== undefined && typeof title !== "string") ||
    (platform !== undefined && typeof platform !== "string") ||
    (description !== undefined && typeof description !== "string") ||
    (releaseYear !== undefined && typeof releaseYear !== "number")
  ) {
    return response.status(400).json({
      message: "Les champs envoyés n'ont pas les bons types",
      error: true
    });
  }

  try {
    const game = await Game.findByPk(id);

    if (!game) {
      return response.status(404).json({
        message: "Il n'y a pas de jeu avec cet ID",
        error: true
      });
    }

    if (title !== undefined) {
      game.title = title;
    }

    if (releaseYear !== undefined) {
      game.releaseYear = releaseYear;
    }

    if (platform !== undefined) {
      game.platform = platform;
    }

    if (description !== undefined) {
      game.description = description;
    }

    await game.save();

    response.status(200).json({
      message: "Jeu modifié avec succès",
      result: game
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Erreur du serveur",
      error: true
    });
  }
};

const deleteOneGameById = async (request, response) => {
  const id = Number(request.params.id);

  if (!id || isNaN(id)) {
    return response.status(400).json({
      message: "L'id doit être de type numérique",
      error: true
    });
  }

  try {
    const game = await Game.findByPk(id);

    if (!game) {
      return response.status(404).json({
        message: "Il n'y a pas de jeu avec cet ID",
        error: true
      });
    }

    await game.destroy();

    response.json({
      message: "Jeu supprimé"
    });
  } catch (error) {
    response.status(500).json({
      message: "Erreur du serveur",
      error: true
    });
  }
};

module.exports = {
  createOneGame,
  getAllGames,
  getOneGameById,
  updateOneGameById,
  deleteOneGameById
};