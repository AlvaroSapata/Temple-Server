const router = require("express").Router();

const isAuthenticated = require("../middlewares/isAuthenticated.js");
const isAdminBack = require("../middlewares/isAdminBack");

const Event = require("../models/Event.model.js");

//GET /api/events => enviar al front end la lista de todos los eventos
router.get("/", async (req, res, next) => {
  try {
    const response = await Event.find().populate("location").populate("djs");
    
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// POST /api/events => recibir del fronted los detalles de un Evento y crearlo en la BD
router.post("/", isAuthenticated, isAdminBack, async (req, res, next) => {
  const { image, title, date, location, djs, joinPeople } =
    req.body;
  if (!title || !date || !location || !image || !djs) {
    res.status(400).json({ message: "Debes rellenar todos los campos" });
    return;
  }
  try {
    await Event.create({
      title,
      date,
      location, 
      
      djs, 
      joinPeople, 
      createdBy: req.payload._id, 
      image,
    });

    res.json("documento creado");
  } catch (error) {
    next(error);
  }
});

//GET /api/events/:id => enviar al fronted los detalles de un evento
router.get("/:eventId", async (req, res, next) => {
  const { eventId } = req.params;
  try {
    const response = await Event.findById(eventId)
      .populate("location")
      .populate("djs");
    res.json(response);
  } catch (err) {
    next(err);
  }
});

//DELETE /api/events/:events => eliminar un evento
router.delete(
  "/:eventId",
  isAuthenticated,
  isAdminBack,
  async (req, res, next) => {
    const { eventId } = req.params;
    try {
      await Event.findByIdAndDelete(eventId);
      res.json("documento eliminado");
    } catch (err) {
      next(err);
    }
  }
);

//PUT /api/events/:eventId => modificar un evento
router.put(
  "/:eventId",
  isAuthenticated,
  isAdminBack,
  async (req, res, next) => {
    const { eventId } = req.params;
    const {
      title,
      date,
      location,
      gallery,
      afterMovie,
      djs,
      joinPeople,
      image,
    } = req.body;
    try {
      console.log(req.payload);
      await Event.findByIdAndUpdate(eventId, {
        title,
        date,
        location,
        gallery,
        afterMovie,
        djs,
        joinPeople,
        createdBy: req.payload._id,
        image,
      });
      res.json("documento modificado");
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:eventId/join",
  isAuthenticated,

  async (req, res, next) => {
    const { eventId } = req.params;
    const { joinPeople } = req.body;
    try {
      await Event.findByIdAndUpdate(
        eventId,
        {
          $addToSet: { joinPeople: req.payload._id },
        },
        { new: true }
      );

      res.json("documento modificado");
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:eventId/unjoin",
  isAuthenticated,

  async (req, res, next) => {
    const { eventId } = req.params;
    const { joinPeople } = req.body;
    try {
      await Event.findByIdAndUpdate(eventId, {
        $pull: { joinPeople: req.payload._id },
      });

      res.json("documento modificado");
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
