require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const historyApiFallback = require('connect-history-api-fallback');
const compression = require('compression');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');

const keys = require('./config/keys');
const webpackConfig = require('../webpack.config');
const routes = require('./routes');

const db = require("./models");

const { port } = keys;
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

db.sequelize.sync({ }).then(() => {
  console.log("Drop and re-sync db.");
});

require('./config/passport');
app.use(routes);


// if development
if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(webpackConfig);

  app.use(
    historyApiFallback({
      verbose: false
    })
  );

  app.use(
    webpackMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      contentBase: path.resolve(__dirname, '../client/public'),
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false
      }
    })
  );

  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(path.resolve(__dirname, '../dist')));
} else {
  app.use(compression());
  app.use(express.static(path.resolve(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
  });
}

const httpServer = require('http').createServer(app)

// const io = require('socket.io')(http);


const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:5000",
  },
});

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    // find existing session
    const session = sessionStore.findSession(sessionID);
    console.log(session, 'session found');
    
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }

  const username = socket.handshake.auth.username;
console.log(username, 'name of user ');

  // console.log(username, 'user connection',socket.handshake);
  if (!username) {
    return next(new Error("invalid user"));
  }

  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;

  console.log(socket, 'socket befor next');
  
  
  next();
});



io.on("connection", (socket) => {
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    console.log(id, 'id with socket');
    
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit("users", users);

  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });
  socket.join(socket.userID);
  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });

  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: false,
      });
    }
  });

  socket.on("private message", ({ content, to }) => {
    console.log(to,'new message comming', content);
    
    socket.to(to).to(socket.userID).emit("private message", {
      content,
      from: socket.id,
      to
    });
  });
  // ...
});


function randomId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}


httpServer.listen(port, () => {
  console.log(
    `${chalk.green('✓')} ${chalk.blue(
      `Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`
    )}`
  );
});
