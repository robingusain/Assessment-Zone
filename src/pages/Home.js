import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    // console.log(id);
    setRoomId(id);
    toast.success("Created a new room");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Room ID & username is required");
      return;
    }
    // Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };
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
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={handleInputEnter}
          />

          {/* <button className="btn joinbtn" onClick={joinRoom}>Join</button> */}

          <button className="joinbtn" onClick={joinRoom}>
            Join
            <div className="inner-button">
              <svg
                id="Arrow"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                height="30px"
                width="30px"
                className="icon"
              >
                <defs>
                  <linearGradient
                    y2="100%"
                    x2="100%"
                    y1="0%"
                    x1="0%"
                    id="iconGradient"
                  >
                    <stop
                      style={{ stopColor: "#FFFFFF", stopOpacity: 1 }}
                      offset="0%"
                    />
                    <stop
                      style={{ stopColor: "#AAAAAA", stopOpacity: 1 }}
                      offset="100%"
                    />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#iconGradient)"
                  d="M4 15a1 1 0 0 0 1 1h19.586l-4.292 4.292a1 1 0 0 0 1.414 1.414l6-6a.99.99 0 0 0 .292-.702V15c0-.13-.026-.26-.078-.382a.99.99 0 0 0-.216-.324l-6-6a1 1 0 0 0-1.414 1.414L24.586 14H5a1 1 0 0 0-1 1z"
                ></path>
              </svg>
            </div>
          </button>

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
