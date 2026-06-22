import express from "express";

import {

  addMedicine,

  getMedicines,

  updateMedicine,

  deleteMedicine,

} from "../controllers/medicineController.js";

import {

  protect,

  adminOnly,

} from "../middleware/authMiddleware.js";

import upload
from "../middleware/multer.js";

const router =
  express.Router();


// ================= ADD =================

router.post(

  "/add",

  protect,

  adminOnly,

  upload.single("image"),

  addMedicine
);


// ================= GET =================

router.get(

  "/",

  getMedicines
);


// ================= UPDATE =================

router.put(

  "/update/:id",

  protect,

  adminOnly,

  upload.single("image"),

  updateMedicine
);


// ================= DELETE =================

router.delete(

  "/:id",

  protect,

  adminOnly,

  deleteMedicine
);

export default router;