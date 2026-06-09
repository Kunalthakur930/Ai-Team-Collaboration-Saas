require("dotenv").config();
const app = require("./app");
const http = require("http");
const connectDb = require("./config/db");
const PORT = process.env.PORT || 5000;
connectDb();
const server = http.createServer(app);
const { initSocket } = require("./socket");
initSocket(server);


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// require("dotenv").config();
// const app = require("./app");
// const connectDb = require("./config/db");
// const PORT = process.env.PORT || 5000;
// connectDb();

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
