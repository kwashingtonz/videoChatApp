import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate,useParams } from "react-router-dom";
//import { useParams } from "react-router-dom";
import io from 'socket.io-client';
import { getUserMediaPromise } from '../../utils/media';
import { fetchRoomAPI, joinRoomAPI } from '../../api/room';
import RemoteUserVideo from '../../components/Room/RemoteUserVideo';
import BottomControls from '../../components/Room/BottomControls';

const Room = ({ peerInstance, currentUserId}) => {
    const navigate = useNavigate()
    const currentMediaStream = useRef(null);
    const currentUserVideoRef = useRef(null);
    const socketInstance = useRef(null);
    const [muted, setMuted] = useState(false);
    const [videoMuted, setVideoMuted] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [name, setName] = useState("");
    const { roomId } = useParams();

    const url = 'http://localhost:3000/rooms/';
    const handleCopy=()=>{
         navigator.clipboard.writeText(roomId)
         alert("copied")
    }

    const CopyUrl=()=>{
        navigator.clipboard.writeText(url+roomId)
        alert("copied")
   }

    const call = useCallback((userId) => {
        if (!peerInstance || !currentMediaStream.current) {
            return Promise.resolve(null);
        }
        const outgoingCall = peerInstance.call(userId, currentMediaStream.current);
        return new Promise((resolve) => {
            const streamListener = (remoteStream) => {
                const newParticipant = {
                    userId,
                    mediaStream: remoteStream
                };
                outgoingCall.off('stream', streamListener);
                resolve(newParticipant);
            };
            outgoingCall.on('stream', streamListener);
        });
    }, [peerInstance]);

    const callEveryoneInTheRoom = useCallback(async (roomId) => {
        try {
            const roomInformation = await fetchRoomAPI(roomId);
            const { participants } = roomInformation;
            console.log(participants)
            if (participants.length) {
                const participantCalls = participants
                    .filter((participant) => participant !== currentUserId)
                    .map((participant) => call(participant));
                Promise.all(participantCalls)
                    .then((values) => {
                    const validParticipants = values.filter(value => value);
                    setParticipants(validParticipants);
                });
            }
        }
        catch (error) {
            console.error(error);
        }
    }, [currentUserId, call]);

    const setCurrentUserVideo = useCallback(async () => {
        if (!currentUserVideoRef.current) {
            return;
        }
        if (!currentUserId) {
            return;
        }
        try {
            const username = JSON.parse(window.sessionStorage.getItem("userdata"))
            if(username){
                setName(username.fname+" "+username.lname)
            }else{
                setName("Guest")
            }
            
            const mediaStream = await getUserMediaPromise({ video: true, audio: true });
            currentUserVideoRef.current.srcObject = mediaStream;
            currentUserVideoRef.current.play();
            currentMediaStream.current = mediaStream;
            await joinRoomAPI(roomId, currentUserId);
            await callEveryoneInTheRoom(roomId);
        }
        catch (error) {
            console.error(error);
        }
    }, [roomId, currentUserId, callEveryoneInTheRoom]);

    useEffect(() => {
        setCurrentUserVideo();
        socketInstance.current = io(process.env.REACT_APP_BACKEND_EXPRESS_HOST);
        socketInstance.current.on('get:peerId', () => {
            socketInstance?.current?.emit('send:peerId', currentUserId);
        });
    }, [currentUserId, setCurrentUserVideo]);

    useEffect(() => {
        const userLeftListener = (peerId) => {
            const filteredParticipants = participants.filter(participant => participant.userId !== peerId);
            setParticipants(filteredParticipants);
        };
        socketInstance?.current?.on('user:left', userLeftListener);
        return () => {
            socketInstance?.current?.off('user:left', userLeftListener);
        };
    }, [participants]);

    useEffect(() => {
        if (!peerInstance) {
            return;
        }
        const incomingCallListener = async (incomingCall) => {
            if (!currentMediaStream.current) {
                return;
            }
            incomingCall.answer(currentMediaStream.current);
            incomingCall.on('stream', function (remoteStream) {
                const newParticipant = {
                    userId: incomingCall.peer,
                    mediaStream: remoteStream
                };
                setParticipants(participants.concat(newParticipant));
            });
        };
        peerInstance.on('call', incomingCallListener);
        return () => peerInstance.off('call', incomingCallListener);
    }, [peerInstance, participants]);

    useEffect(() => {
        if (!currentMediaStream.current) {
            return;
        }
        const videoTracks = currentMediaStream.current.getVideoTracks();
        if (videoTracks[0]) {
            videoTracks[0].enabled = !videoMuted;
        }
    }, [videoMuted]);

    useEffect(() => {
        if (!currentMediaStream.current) {
            return;
        }
        const audioTracks = currentMediaStream.current.getAudioTracks();
        if (audioTracks[0]) {
            audioTracks[0].enabled = !muted;
        }
    }, [muted]);

    return (
    <div className="v-container">
    <div className="myId">
      <strong>RoomId: {roomId}<br></br> {name} </strong>

      <button  type="submit" variant="primary" onClick={handleCopy}>
         Copy ID
          </button>
          <button   variant="primary" onClick={CopyUrl}  >
         Copy Link
          </button>
    </div>

    
  
    
    <div className='video-container'>
        <video ref={currentUserVideoRef} muted style={{width:"300px"}}/>
        </div>
      
      {participants.map(participant => (<RemoteUserVideo key={participant.userId} remoteStream={participant.mediaStream}/>))}
   
 
  <BottomControls onLeave={() => {
        socketInstance?.current?.disconnect();
        navigate(`/landing`);
    }} toggleMute={() => setMuted(!muted)} toggleVideoMute={() => setVideoMuted(!videoMuted)} muted={muted} videoMuted={videoMuted}/>
 </div>);
};
export default Room;
