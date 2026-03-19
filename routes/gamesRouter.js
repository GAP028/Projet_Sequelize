const express = require("express");
const {
  createOneGame,
  getAllGames,
  getOneGameById,
  updateOneGameById,
  deleteOneGameById
} = require("../controllers/gameController");

const gamesRouter = express.Router();

gamesRouter.post("/", createOneGame);
gamesRouter.get("/", getAllGames);
gamesRouter.get("/:id", getOneGameById);
gamesRouter.patch("/:id", updateOneGameById);
gamesRouter.delete("/:id", deleteOneGameById);

module.exports = gamesRouter;