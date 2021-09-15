import React, { useEffect, useState } from 'react';
import socketClient from "socket.io-client";
import { Container } from "@material-ui/core";
import Messages from "./Messages";
import InputMsg from "./InputMsg.js";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

const SERVER = "/";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  scroll: {
    height: "59vh",
    overflowY: "scroll",
  },
}));
let socket;
export default (props) => {
  const classes = useStyles();
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState();
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState({})
  const user = useSelector((state) => state.account.user);

  const configureSocket1 = () => {
    socket = socketClient(SERVER, { autoConnect: false });
    const sessionID = localStorage.getItem("sessionID");

    if (sessionID && sessionID!= null) {
      socket.auth = { sessionID };
    } else {
      socket.auth = { username: user?.firstName };
    }

    socket.connect();

    socket.onAny((event, ...args) => {
      console.log('test', event, args);
    });

    socket.on("connect_error", (err) => {
      
      if (err.message === "invalid username") {
        // usernameAlreadySelected = false;
        alert("Error while Socket Connection")
      }
    });

    socket.on("users", (users) => {
      users.forEach((user) => {
        user.self = user.userID === socket.id;

        // initReactiveProperties(user);
      });
      // put the current user first, and then sort by username
      users = users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      setUserList(users)
    });

    socket.on("session", ({ sessionID, userID }) => {
      
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.userID = userID;
    });

    socket.on("private message", ({ content, from }) => {
      for (let i = 0; i < userList?.length; i++) {
        const user = userList[i];
        if (user.userID === from) {
          user.messages = user.messages || []

          user?.messages?.push({
            content,
            fromSelf: false,
          });
          if (user !== selectedUser) {
            user.hasNewMessages = true;
          }
          setSelectedUser(user);
          break;
        }
      }
    });

    socket.on("user connected", (user) => {
      // initReactiveProperties(user);
      // console.log(user, 'user coonnneeeccttteeedd');
      userList.push(user)
      setUserList(userList)
    });

    socket.on("connect", () => {
      userList?.forEach((user) => {
        if (user.self) {
          user.connected = true;
        }
      });
      setUserList(userList)
    });

    socket.on("disconnect", () => {
      userList?.forEach((user) => {
        if (user.self) {
          user.connected = false;
        }
      });
      setUserList(userList)
    });
  }



  useEffect(() => {
    configureSocket1()
    return () => {
      localStorage.removeItem('sessionID')
      socket?.off();
    };
  }, [])

  const onMessage = (e) => {
    e.preventDefault()

    if (selectedUser) {
      // alert(selectedUser)
      socket.emit("private message", {
        content: message,
        to: selectedUser?.userID,
      });
      selectedUser?.messages?.push({
        content: message,
        fromSelf: true,
      });
      setSelectedUser(selectedUser)
    }
    setMessage('')
  }


  return (
    <Container className={classes.wrapper}>
      <div>
        {userList?.map(item => <h3 key={item.userID} onClick={() => {
          setSelectedUser(item)
        }}>{item.username}</h3>)}
      </div>
      <Container className={classes.container}>
        <div className={classes.scroll}>
          <Messages messages={selectedUser?.messages || []} nickname={nickname} />
        </div>
        <InputMsg
          message={message}
          setMessage={setMessage}
          sendMessage={onMessage}
        />
      </Container>
    </Container>
  );
}