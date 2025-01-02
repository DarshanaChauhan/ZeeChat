import React, { useEffect, useState } from "react";
import { user } from "../Join/Join";
import socketIO from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../image/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeimg from "../../image/closeimg.png"
const ENDPOINT = "http://localhost:4500";

let socket;

const Chat = () => {
  const [id, setId] = useState("");
  const [messages, setMessages] = useState([]);

  const send = () => {
    const message = document.getElementById("chatInput").value;
    if (message.trim()) {
      socket.emit("message", { message, id });
    //   setMessages((prevMessages) => [
    //     ...prevMessages,
    //     { user: "You", message },
    //   ]);
      document.getElementById("chatInput").value = "";
    }
  };

  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {
      alert("Connected");
      setId(socket.id);
    });

    socket.emit("joined", { user });

    socket.on("welcome", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("userJoined", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("leave", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("sendMessage");
    };
  }, []);

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header">
            <h2>ZEE CHAT</h2>
            <a href="/"><img src={closeimg} alt="close"/></a>


        </div>
        <ReactScrollToBottom className="chatBox">
          {messages.map((item, i) => (
            <Message
              key={i}
              user={item.id === id ? "" : item.user}
              message={item.message}
              classs={item.id === id ? "right" : "left"}
            />
          ))}
        </ReactScrollToBottom>
        <div className="inputBox">
          <input onKeyDown={(event) => {
              if (event.key === 'Enter') {
                send();
                event.preventDefault();
              }
            }}  type="text" id="chatInput" />
          <button onClick={send} className="sendbtn">
            <img src={sendLogo} alt="send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;




// import React, { useEffect, useState } from 'react';
// import {user} from '../Join/Join';
// import socketIO from "socket.io-client";
// import "./Chat.css"
// import sendLogo from "../../image/send.png"
// import { data } from 'react-router-dom';
// import Message from "../Message/Message"
// import ReactScrollToBottom from "react-scroll-to-bottom";

// const ENDPOINT = "http://localhost:4500";

// let socket;

// const Chat = () => {

//     const [id, setid]=useState("");
//     const [messages,setMessages]=useState([])

//     const send= ()=>{
//         const message = document.getElementById('chatInput').value;
//         socket.emit("message",{message,id});
//         document.getElementById('chatInput').value="";
//     }

//     useEffect(()=>{ 
//         socket = socketIO(ENDPOINT, {transports: ['websocket']});

//         socket.on("connect",()=>{
//             alert("Connected");
//             setid(socket.id);
//         });

//         socket.emit("joined",{user});

//         socket.on("welcome",(data)=>
//         {
//             setMessages([...messages,data]);
//             console.log(data.user,data.message);
//         })

//     socket.on("userJoined",(data)=>
//         {
//             setMessages([...messages,data]);
//             console.log(data.user,data.message);
//         })

//     socket.on("leave",(data)=>
//     {
//         setMessages([...messages,data]);
//         console.log(data.user,data.message);
//     })
//     return()=>{
//       socket.disconnect();
//       socket.off();
      
//     }
// }, [])

// useEffect(()=>{
//     socket.on("sendMessage",(data)=>{
//         console.log(data.user,data.message, data.id);
//     })
//     return ()=>{
//         socket.off();
//     }
// },[messages])


//   return (
//     <div className='chatPage'>
//         <div className='chatContainer'>
//             <div className='header'>

//             </div>
//             <ReactScrollToBottom className='chatBox'>
//                 {messages.map((item,i)=><Message user={item.id===id?'':item.user}message={item.message} classs={item.id===id?'right':'left'}/>)}
                
//             </ReactScrollToBottom>
//             <div className='inputBox'>
//                 <input type='text' id='chatInput' />
//                 <button onClick={send} className='sendbtn'>
//                     <img src={sendLogo} alt='send' />
//                 </button>

//             </div>
//         </div>
//     </div>
//   )
// }

// export default Chat
