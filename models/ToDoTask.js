const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();
//It is mandatory to connect to the database from the model beacuse the connection is 
// getting lost after the API is triggered
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true)
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
});
const ToDoTaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('ToDoTask',ToDoTaskSchema);