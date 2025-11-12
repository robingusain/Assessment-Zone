import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate=useNavigate();

  const [roomId, setRoomId] = useState("");
  const[username, setUsername] = useState("");
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    // console.log(id);
    setRoomId(id);
    toast.success("Created a new room");
  };

  const joinRoom = () => {
    if(!roomId || !username){
      toast.error("Room ID & username is required");
      return;
    }
    // Redirect
    navigate(`/editor/${roomId}`,{state:{
      username,
    }});  
  
  };

  const handleInputEnter=(e)=>{
    if(e.code==="Enter"){
      joinRoom();
    }
  }
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img className="homepagelogo" src="/logo.png" alt="code sync logo" />
        <h4 className="mainLabel">Paste Room ID</h4>
        <div className="inputgroup">
          <input
            type="text"
            placeholder="Room ID"
            className="inputbox"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <input 
            type="text" 
            placeholder="Username" 
            className="inputbox" 
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <button className="btn joinbtn" onClick={joinRoom}>Join</button>
          <span className="createinfo">
            If you don't have an invite then create &nbsp;
            <a href="" className="createNewBtn" onClick={createNewRoom}>
              New Room
            </a>
          </span>
        </div>
      </div>
      {/* <h4 className='footer'>Built with 💖 by <a href='https://github.com/robingusain/Assessment-Zone.git'>RRS</a></h4> */}
    </div>
  );
};

export default Home;
