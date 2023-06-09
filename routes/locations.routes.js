const router = require("express").Router();

const isAuthenticated = require("../middlewares/isAuthenticated");
const isAdminBack = require("../middlewares/isAdminBack");

const Location = require("../models/Location.model");

// Rutas CRUD de

// GET "/api/locations" => Envia al FE todas las Locations
router.get("/", async (req, res, next) => {
  try {
    const response = await Location.find();
    
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// POST "/api/locations" => Recibe data del FE y crea una nueva Location en la DB
router.post("/", isAuthenticated, isAdminBack, async (req, res, next) => {
  try {
   
    // Destructuramos el req.body
    const { name, image, description, address } = req.body;
    if (!name || !address || !description || !image) {
      res.status(400).json({ message: "Debes rellenar todos los campos" });
      return;
    }
    const response = await Location.create({
      name,
      image,
      description,
      address,
      createdBy: req.payload._id,
    });
    
    res.json(response);
  } catch (error) {
    if (!name || !image || !description || !address) {
      res.status(400).json({ message: "Debes rellenar todos los campos" });
      return;
    }
    next(error);
  }
});

// GET "/api/locations/:locationId" => Envia al FE una Location por su ID
router.get("/:locationId", async (req, res, next) => {
  // Destructuramos el req.params
  const { locationId } = req.params;
  try {
    const response = await Location.findById(locationId);
    
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// DELETE "/api/locations/:locationId" => Borra una location por su ID
router.delete(
  "/:locationId",
  isAuthenticated,
  isAdminBack,
  async (req, res, next) => {
    // Destructuramos el req.params
    const { locationId } = req.params;
    try {
      const response = await Location.findByIdAndDelete(locationId);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

// PUT "/api/locations/:locationId" => Edita una location por su ID
router.put(
  "/:locationId",
  isAuthenticated,
  isAdminBack,
  async (req, res, next) => {
    // Destructuramos el req.params y el req.body
    const { locationId } = req.params;
    // Destructuramos el req.body
    const { name, image, description, address, createdBy } = req.body;
    try {
      const response = await Location.findByIdAndUpdate(locationId, {
        name,
        image,
        description,
        address,
      });
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
