const User = require("../models/user");
// const bcrypt = require("bcrypt");

exports.getAllUsers = (req, res, next) => {
  User.findAll()
    .then((users) => res.json({ data: users }))
    .catch((err) => next(err));
};

exports.getUser = async (req, res) => {
  let userId = parseInt(req.params.id);

  // Vérification si le champ id est présent et cohérent
  if (!userId) {
    return res.status(400).json({ message: "missing parameter" });
  }

  try {
    // Récupération de l'utilisateur et vérification
    let user = await User.findOne({ where: { id: userId }, raw: true });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.json({ data: user });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};

exports.addUser = async (req, res) => {
  //Validation des données reçues
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Création de l'utilisateur
    let newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });
    return res.json({ message: "User created", data: newUser });
  } catch (err) {
    if (err.name == "SequelizeDatabaseError") {
      res.status(500).json({ message: "Database Error", error: err });
    }
    res.status(500).json({ message: "Hash Process Error", error: err });
  }
};

exports.updateUser = async (req, res) => {
  let userId = parseInt(req.params.id);

  if (!userId) {
    return res.status(400).json({ message: "missing parameter" });
  }
  try {
    // Recherche de l'utilisateur
    let user = await User.findOne({ where: { id: userId }, raw: true });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Mise à jour de l'utilisateur
    await User.update(req.body, { where: { id: userId } });

    return res.json({ message: "user updated" });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};

exports.untrashUser = (req, res) => {
  let userId = parseInt(req.params.id);

  if (!userId) {
    return res.status(400).json({ message: "missing parameter" });
  }

  User.restore({ where: { id: userId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

exports.trashUser = (req, res) => {
  let userId = parseInt(req.params.id);
  if (!userId) {
    return res.status(400).json({ message: "missing parameter" });
  }

  // Suppression de l'utilisateur
  User.destroy({ where: { id: userId } })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};

// delete hard / supprime complètement de la db
exports.deleteUser = (req, res) => {
  let userId = parseInt(req.params.id);
  if (!userId) {
    return res.status(400).json({ message: "missing parameter" });
  }

  // Suppression de l'utilisateur
  User.destroy({ where: { id: userId }, force: true })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database error", error: err })
    );
};
