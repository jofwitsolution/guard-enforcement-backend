require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const { mongodb } = require("./db");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");
const rootRoute = require("./routes/root");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

if (!process.env.JWT_SECRET) {
  throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
}

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));

// built-in middleware for json
app.use(express.json({ limit: "50mb" }));
// app.use(cookieParser());

app.use(cookieParser(process.env.JWT_SECRET));
// Cross Origin Resource Sharing
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.SERVER_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

//Routes
app.use("/", rootRoute);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//Error Handler
app.use(errorHandler);
app.use(notFound);

// Helmet for security purposes. Compression for efficiency
app.use(helmet());
app.use(
  compression({
    level: 6,
    threshold: 0,
  })
);

// connect to mongodb
mongodb();

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
