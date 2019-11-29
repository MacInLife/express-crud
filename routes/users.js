var express = require("express");
var router = express.Router();
//apport de compte user
const fs = require("fs");
let rawdata = fs.readFileSync("./users.json");
const users = JSON.parse(rawdata);

var router = express();

const Joi = require("@hapi/joi");
var methodOverride = require("method-override");

// override with the X-HTTP-Method-Override header in the request
router.use(methodOverride("X-HTTP-Method-Override"));

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.render("users/index", { users });
});

//GET - router/users/:id - Get a user
router.get("/:id", function(req, res, next) {
  console.log(req.params.id);

  const user = users.find(u => u.id == req.params.id);
  if (!user) {
    return res
      .status(404)
      .send("L'utilisateur n'existe pas ! Liste d'un utilisateur");
  }
  res.render("users/users-id", { user });

  //PUT - router/users/:id : Update a user
  router.post("/:id", (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).send("L'utilisateur n'existe pas ! Modifié");
    }
    //Vérification des données requises
    const schema = Joi.object({
      name: Joi.string()
        .min(3)
        .required(),
      username: Joi.string()
        .min(3)
        .required(),
      email: Joi.string()
        .email()
        .required()
    });
    const validation = schema.validate(req.body);
    if (validation.error) {
      return res.status(400).send(validation.error.details[0].message);
    }

    //User Modification
    (user.name = req.body.name),
      (user.username = req.body.username),
      (user.email = req.body.email);

    //res.render(userId);
    //res.send(user);
    res.redirect("/users");
  });

  //DELETE - router/users/:id : Delete a user
  router.post("/del/:id", (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).send("L'utilisateur n'existe pas ! Suppression");
    }

    //User Delete
    const index = users.indexOf(user);
    users.splice(index, 1);
    //renvoi l'utilisateur supprimé
    //res.render(user);
    // renvoi tout les utilisateurs sauf celui supprimé
    //res.send(users);

    res.redirect("/users");
  });
});

//POST - router/users : Create a new user
router.post("/users/index", (req, res) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .required(),
    username: Joi.string()
      .min(3)
      .required(),
    email: Joi.string()
      .email()
      .required()
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }

  //User Création
  const user = {
    id: users.length + 1,
    name: req.body.name,
    username: req.body.username,
    email: req.body.email
  };
  users.push(user);

  //res.send(user);
  return res.redirect("/users");
  //res.render(user);
});

module.exports = router;
