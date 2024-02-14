// backend.js
import express from "express";
import cors from "cors";
import userService from './user-services.js';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userService.addUser(userToAdd)
    .then(newUser => res.status(201).send(newUser))
    .catch(error => res.status(500).send(error));
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  userService.findUserById(id)
    .then(user => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).send("Resource not found.");
      }
    })
    .catch(error => res.status(500).send(error));
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  if (name && job) {
    userService.findUsersByBoth(name, job)
      .then(users => res.send({ users_list: users }))
      .catch(error => res.status(500).send(error));
  } else {
    userService.getUsers(name, job)
      .then(users => res.send({ users_list: users }))
      .catch(error => res.status(500).send(error));
  }
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  userService.deleteUserById(id)
    .then(result => {
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).send({ error: "User not found." });
      }
    })
    .catch(error => res.status(500).send(error));
});
app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});