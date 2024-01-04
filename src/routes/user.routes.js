import { Router } from "express"
import registrationValidate from "../middlewares/registerErrHandle.middleware.js";
import { registerUser } from "../controllers/user.controller.js";
import loginValidate from "../middlewares/loginErrHandle.middleware.js";
import { userLogin } from "../controllers/user.controller.js";
import contentValidate from "../middlewares/noteErrHandle.middleware.js";
import { verifyToken } from "../middlewares/auth.middlware.js";
import { addNotes } from "../controllers/user.controller.js";
import { getAllNotes } from "../controllers/user.controller.js";
import { getNoteById } from "../controllers/user.controller.js";
import { updateNote } from "../controllers/user.controller.js";
import { deleteNote } from "../controllers/user.controller.js";
import { deleteUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginValidate,userLogin)
router.route("/addnote").post(contentValidate,verifyToken,addNotes)
router.route("/allnotes").get(verifyToken,getAllNotes)
router.route("/note/:noteId").get(verifyToken,getNoteById)
router.route("/updatenote/:noteId").put(verifyToken,contentValidate,updateNote)
router.route("/deletenote/:noteId").delete(verifyToken,deleteNote)
router.route("/deleteuser/:userId").delete(deleteUser)
export default router

