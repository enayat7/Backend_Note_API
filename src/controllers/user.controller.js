import { User } from "../models/user.model.js";
import { Note } from "../models/notes.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const registerUser = async(req,res) =>{
    // console.log(123456)
    const { username, fullname, email, password} = req.body;
    // console.log(123456)
    try {
        const user_email = await User.findOne({ email });
        const user_name = await User.findOne({username});
        if (user_email) {
            return res.send({message: "Email already exists" });
        }
        if(user_name){
            return res.send({message: "Username already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullname,
            username,
            email,
            password: hashPassword,
        });
        await newUser.save();
        const saved_user = await User.findOne({ email: email });
        const token = jwt.sign(
            { userID: saved_user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.EXPIRY_TIME }
        );
        return res.status(201).send({
            "message": "Registration Success",
            "token": token,
        });
    }
    catch(err){
        return res.status(400).send({ "error" : "Invalid registration" })
    }
}

const userLogin = async(req,res) =>{
    const { email, password,username } = req.body;
    // console.log(email) 
    // console.log(password)
    try{
        const user = email ? await User.findOne({email}) : await User.findOne({username})
        // console.log(user)
        if(!user) return res.status(400).send({ message:"No account"})
        const isMatch=await  bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRY_TIME })
            return res.status(201).send({
                "message": "Login Success",
                user,
                "token": token })
        }
        if(username ) return res.status(400).send({
            "message": "username or Password is Incorrect"
        })
        return res.status(400).send({
            "message": "email or Password is Incorrect"
        })
    }
    catch(err){
        return res.status(400).send({ "message" : "invalid credential" })
    }
}

const addNotes = async(req,res) =>{
    const { title, content } = req.body
    const { userID } = req.authData
    // console.log(title)
    // console.log(userID)
    try {
        const user = await User.findOne({_id:userID})
        // console.log(user)
        let newNote=new Note({
            title,
            content,
            createdBy: user._id,
        })
        const savedNote = await newNote.save()
        return res.status(201).send({
            "message":"content upload successfully",
            savedNote
        })
    } catch (err) {
        return res.status(400).send("Unable to add Note")
    }
}

const getAllNotes = async(req,res) =>{
    const { userID } = req.authData
    try{
        const notes = await Note.find({createdBy: userID}).sort('-date')
        return res.status(201).send({ "Notes" : notes })
    }
    catch(err){
        return res.status(400).send({ "error" : "cannot retrive notes" })
    }
}

const getNoteById = async(req,res) =>{
    const { noteId }= req.params
    try{
        const note = await Note.findOne({_id:noteId})
        return res.status(201).send({ "Note" : note })
    }
    catch(err){
        return res.status(400).send({"Error" : err});
    }
}

const updateNote = async(req,res) =>{
    // console.log(123456543)
    const { noteId } = req.params
    const { title, content } = req.body
    try{
        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            { title, content },
            { new : true }
        )
        return res.status(201).send({
            "message" : "Note updated successfully",
            updatedNote
        })
    }
    catch(err){
        return res.status(400).send({
            "error" : "Cannot Update the note"
        })
    }
}

const deleteNote = async(req,res) =>{
    const { noteId } = req.params
    try{
        const deletedNote = await Note.findByIdAndDelete(noteId);
        return res.status(201).send({
            "message" : "Note deleted successfully",
        })
    }
    catch(err){
        return res.status(400).send({
            "error" : "Failed to Delete the note"
        });
    }
}

const deleteUser = async(req,res) =>{
    const { userId } = req.params
    try{
        const deletedUser = await User.findByIdAndDelete(userId);
        return res.status(201).send({
            "message" : "User deleted successfully",
        })
    }
    catch(err){
        return res.status(400).send({
            "error" : "Failed to Delete the note"
        });
    }
}

export {
    registerUser,
    userLogin,
    addNotes,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
    deleteUser,
}