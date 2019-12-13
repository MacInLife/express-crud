var express = require("express");
var router = express.Router();
const fs = require("fs");
//apport de compte user
let rawdata = fs.readFileSync("./users.json");
const users = JSON.parse(rawdata);

var flash = require("connect-flash");
//const users = JSON.parse(rawdata);
// const request = require("request-json");
// const data = __dirname + "/../data/users.json";
// const client = request.createClient("https://jsonplaceholder.typicode.com/");

// client.get("users", function(err, res, body) {
//   fs.writeFile(data, JSON.stringify(body), err => {});
// });

// let rawdata = fs.readFileSync(data);
// const users = JSON.parse(rawdata);

var router = express();

const Joi = require("@hapi/joi");
var methodOverride = require("method-override");

// override with the X-HTTP-Method-Override header in the request
router.use(methodOverride("_method"));

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.render("users/index", { users, error: req.flash("error") });
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
  router.put("/:id", (req, res) => {
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
    //const { error } = validateCustomer(req.body); //result.error
    if (validation.error) {
      //return res.status(400).send(validation.error.details[0].message);
      req.flash("error", validation.error.details[0].message);
      return res.redirect("/users");
    }

    //User Modification
    (user.name = req.body.name),
      (user.username = req.body.username),
      (user.email = req.body.email);

    return res.redirect("/users");
    // if (error) {
    //
    //   return res.redirect("/users", { user, error: req.flash("error") });
    // }
  });

  //DELETE - router/users/:id : Delete a user
  router.delete("/del/:id", (req, res) => {
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

  let max = Math.max(...users.map(user => user.id));
  //User Création
  const user = {
    id: max + 1,
    name: req.body.name,
    username: req.body.username,
    email: req.body.email
  };
  users.push(user);

  //res.send(user);
  return res.redirect("/users");
  //res.render(user);
});

// //PUT - router/users/:id : Update a user
// router.put("/:id", (req, res) => {
//   const user = users.find(u => u.id === parseInt(req.params.id));
//   if (!user) {
//     return res.status(404).send("L'utilisateur n'existe pas ! Modifié");
//   }
//   //Vérification des données requises
//   const schema = Joi.object({
//     name: Joi.string()
//       .min(3)
//       .required(),
//     username: Joi.string()
//       .min(3)
//       .required(),
//     email: Joi.string()
//       .email()
//       .required()
//   });
//   const validation = schema.validate(req.body);
//   if (validation.error) {
//     return res.status(400).send(validation.error.details[0].message);
//   }

//   //User Modification
//   (user.name = req.body.name),
//     (user.username = req.body.username),
//     (user.email = req.body.email);

//   //res.render(userId);
//   //res.send(user);
//   res.redirect("/users");
//});

module.exports = router;
