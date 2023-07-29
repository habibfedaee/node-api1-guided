// IMPORTS AT THE TOP
const express = require("express");
const Dog = require("./dog-model");
// INSTANCE OF EXPRESS APP
const server = express();
// GLOBAL MIDDLEWARE
server.use(express.json());
// ENDPOINTS
server.get("/hello-world", (req, res) => {
  res.json({ message: "hello world!" });
  //res.json({ hello: " world!" });
});

// [GET]    /             (Hello World endpoint)
// [GET]    /api/dogs     (R of CRUD, fetch all dogs)
server.get("/api/dogs", async (req, res) => {
  try {
    const dogs = await Dog.findAll();

    res.status(200).json(dogs);
  } catch (error) {
    res.status(500).json({ message: `something terrible ${error.message}` });
  }
});
// [GET]    /api/dogs/:id (R of CRUD, fetch dog by :id)
server.get("/api/dogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dog = await Dog.findById(id);
    if (!dog) {
      res.status(404).json({ message: `no dog with id ${id}` });
    } else {
      res.status(200).json(dog);
    }
    //console.log("the dog: " + dog);
  } catch (error) {
    res.status(500).json({
      message: `Error fetching dogs ${req.params.id}: ${error.message}`,
    });
  }
});
// [POST]   /api/dogs     (C of CRUD, create new dog from JSON payload)
server.post("/api/dogs", async (req, res) => {
  try {
    const { name, weight } = req.body;
    if (!name || !weight) {
      res.status(422).json({
        message: "dogs need name and weight",
      });
    } else {
      const createdDog = await Dog.create({ name, weight });
      res.status(201).json({
        messgage: "dog created",
        data: createdDog,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Error creating dog: ${error.message}`,
    });
  }
});
// [PUT]    /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)
server.put("/api/dogs/:id", async (req, res) => {
  try {
    //throw new Error("oops!");
    const { id } = req.params;
    const { name, weight } = req.body;
    if (!name || !weight) {
      res.status(422).json({
        message: "error updating: dogs need name and weight",
      });
    } else {
      const updatedDog = await Dog.update(id, { name, weight });
      if (!updatedDog) {
        res.status(404).json({
          message: `dog with the id of ${id} was not found, sorry, report your dog loss to 911`,
        });
      } else {
        res.status(200).json({
          message: "dog was updated",
          data: updatedDog,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: `errrr updating dogg ${error.message}`,
    });
  }
});
// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)
server.delete("/api/dogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDog = await Dog.delete(id);

    if (!deletedDog) {
      res.status(404).json({
        message: `dog with id: ${id} was not found`,
      });
    } else {
      res.json({
        message: `dog was deleted ;(`,
        data: deletedDog,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Errr deleting the dog: ${error.message}`,
    });
  }
});

// EXPOSING THE SERVER TO OTHER MODULES
module.exports = server;
