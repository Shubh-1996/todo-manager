const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
//models
const ToDoTask = require("./models/ToDoTask");
dotenv.config();
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

//connection to db should be done within the model
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true)
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");

    app.listen(3000, () => console.log("Server Up and running"));
});

//view engine configuration
app.set("view engine", "ejs");
//GET METHOD
app.get("/", (req, res) => {
    ToDoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});
//POST METHOD-CREATE
app.post('/', async (req, res) => {
    const todoTask = new ToDoTask({
        content: req.body.content,
        category: req.body.category
    });
    try {
        console.log("inside post try", req.body.content)
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

//UPDATE
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        ToDoTask.find({}, (err, tasks) => {
            res.render("viewedit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        console.log("Edit req ", req)
        ToDoTask.findByIdAndUpdate(id, { content: req.body.content,category: req.body.category }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });
//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    ToDoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});