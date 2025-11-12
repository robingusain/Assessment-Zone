import React, {useState, useRef} from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';


const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const {roomId} = useParams(); 
  const reactNavigator = useNavigate();
    const [clients, setClients] = React.useState([]);

  useEffect(()=>{
    const init = async()=>{
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error',(err)=>handleErrors(err));
      socketRef.current.on('connect_failed',(err)=>handleErrors(err));

      function handleErrors(e){
        console.log("Socket connection error",e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN,{
        roomId,
        username:location.state?.username,
      } );
      // listenning for joined event
      socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId})=>{
        if(username !== location.state?.username){
          toast.success(`${username} joined the room`);
          console.log(`${username} joined`);
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE,{
          code:codeRef.current,
          socketId,
        });

      });
      // listenning for disconnected event
      socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
        toast.success(`${username} left the room`);
        setClients((prev)=>{
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return ()=>{
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  },[]);


  async function copyRoomId(){
    try{
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch(err){
      toast.error("Could not copy the Room ID"); 
      console.error(err);
    }
  }

  function leaveRoom(){
    reactNavigator('/');
  }

  if(!location.state){
    return <Navigate to="/" />
  }
  // <Navigate/>
  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          <div className='logo'>
            <img src="/logo.png" alt="code-sync-logo" className='logoImage' />
          </div>
          <h3>Connected</h3>
          <div className='clientsList'>
            {clients.map((client)=>(<Client key={client.socketId} username={client.username} />))}
          </div>
        </div>
        <button className='btn copyBtn' onClick={copyRoomId}>Copy Room ID</button>
        <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
      </div>

      <div className='editorWrap'>
        <Editor socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code)=>{
          codeRef.current=code;
          }
        } 
        />
      </div>
    </div>
  )
}

export default EditorPage