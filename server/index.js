require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");

const connection = require("./connection");
const setupSocket = require("./socket/socket"); 
const registerRouter = require("./router/register"); 
const message_router = require("./router/message")
const userDetails = require("./router/userDetails")
const contact_router = require("./router/contact")
const app = express();
const server = http.createServer(app); 

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connection(process.env.MONGO_URI);

// Setup WebSockets
setupSocket(server);

// Routes
app.use("/", registerRouter);
app.use("/", userDetails);
app.use("/", message_router);
app.use("/", contact_router);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
