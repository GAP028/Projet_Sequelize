const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const register = async (request, response) => {
  const { username, email, password, role } = request.body;

  if (
    !username ||
    !email ||
    !password ||
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return response.status(400).json({
      message: "Le corps de la requête doit contenir username, email et password en string",
      error: true
    });
  }

  try {
    const existingUserByUsername = await User.findOne({
      where: { username: username }
    });

    if (existingUserByUsername) {
      return response.status(409).json({
        message: "Ce username existe déjà",
        error: true
      });
    }

    const existingUserByEmail = await User.findOne({
      where: { email: email }
    });

    if (existingUserByEmail) {
      return response.status(409).json({
        message: "Cet email existe déjà",
        error: true
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: username,
      email: email,
      passwordHash: passwordHash,
      role: role && typeof role === "string" ? role : "user"
    });

    response.status(201).json({
      message: "Utilisateur inscrit avec succès",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      }
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "L'utilisateur n'a pas pu être créé à cause du serveur",
      error: true
    });
  }
};

const signin = async (request, response) => {
  const { email, password } = request.body;

  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return response.status(400).json({
      message: "Le corps de la requête doit contenir email et password en string",
      error: true
    });
  }

  try {
    const user = await User.findOne({
      where: { email: email }
    });

    if (!user) {
      return response.status(404).json({
        message: "Aucun utilisateur trouvé avec cet email",
        error: true
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return response.status(401).json({
        message: "Mot de passe incorrect",
        error: true
      });
    }

    response.json({
      message: "Connexion réussie",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Erreur du serveur",
      error: true
    });
  }
};

const getAllUsers = async (request, response) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "role", "createdAt", "updatedAt"]
    });

    response.json({
      message: "Utilisateurs trouvés",
      results: users
    });
  } catch (error) {
    response.status(500).json({
      message: "Erreur du serveur",
      error: true
    });
  }
};

const getOneUserById = async (request, response) => {
  const id = Number(request.params.id);

  if (!id || isNaN(id)) {
    return response.status(400).json({
      message: "L'id doit être de type numérique",
      error: true
    });
  }

  try {
    const user = await User.findByPk(id, {
      attributes: ["id", "username", "email", "role", "createdAt", "updatedAt"]
    });

    if (!user) {
      return response.status(404).json({
        message: "Il n'y a pas d'utilisateur avec cet ID",
        error: true
      });
    }

    response.json({
      message: "Utilisateur trouvé",
      result: user
    });
  } catch (error) {
    response.status(500).json({
      message: "Erreur du serveur",
      error: true
    });
  }
};

const updateOneUserById = async (request, response) => {
  const id = Number(request.params.id);

  if (!id || isNaN(id)) {
    return response.status(400).json({
      message: "L'id doit être de type numérique",
      error: true
    });
  }

  const { username, email } = request.body;

  if (
    (username !== undefined && typeof username !== "string") ||
    (email !== undefined && typeof email !== "string")
  ) {
    return response.status(400).json({
      message: "username et email doivent être de type string",
      error: true
    });
  }

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return response.status(404).json({
        message: "Il n'y a pas d'utilisateur avec cet ID",
        error: true
      });
    }

    if (username !== undefined) {
      user.username = username;
    }

    if (email !== undefined) {
      user.email = email;
    }

    await user.save();

    response.status(200).json({
      message: "Utilisateur modifié avec succès",
      result: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Erreur du serveur",
      error: true
    });
  }
};

const deleteOneUserById = async (request, response) => {
  const id = Number(request.params.id);

  if (!id || isNaN(id)) {
    return response.status(400).json({
      message: "L'id doit être de type numérique",
      error: true
    });
  }

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return response.status(404).json({
        message: "Il n'y a pas d'utilisateur avec cet ID",
        error: true
      });
    }

    await user.destroy();

    response.json({
      message: "Utilisateur supprimé"
    });
  } catch (error) {
    response.status(500).json({
      message: "Erreur du serveur",
      error: true
    });
  }
};

module.exports = {
  register,
  signin,
  getAllUsers,
  getOneUserById,
  updateOneUserById,
  deleteOneUserById
};