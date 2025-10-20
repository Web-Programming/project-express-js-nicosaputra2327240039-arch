const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user");

//url create - POST (/api/user)
router.post("/", userController.create);

//url read all - GET (/api/user)
router.get("/", userController.all);

//url read one - detail - GET (/api/user/:id)
router.get("/:id", userController.detailuser);

//url update - PUT (/api/user/:id)
router.put("/:id", userController.update);

//url delete - DELETE (/api/user/:id)
router.delete("/:id", userController.remove);

module.exports = router;