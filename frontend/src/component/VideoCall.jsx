import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import SimplePeer from "simple-peer";

const socket = io("http://localhost:5000");

const VideoCall = ({id}) => {
  const [stream, setStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const myVideo = useRef();
  const userVideo = useRef();
  const roomId = id; // Replace with dynamic room ID

  useEffect(() => {
    // Get user media (camera and microphone)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      myVideo.current.srcObject = stream;
      socket.emit("join-room", roomId, socket.id);
    });

    socket.on("user-connected", (userId) => {
      console.log("User connected:", userId);
      const peer = createPeer(userId, socket.id, stream);
      setPeer(peer);
    });

    socket.on("receive-offer", (offer) => {
      const peer = answerPeer(offer, stream);
      setPeer(peer);
    });

    socket.on("receive-answer", (answer) => {
      peer.signal(answer);
    });

    socket.on("receive-ice-candidate", (candidate) => {
      peer.signal(candidate);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createPeer = (userId, callerId, stream) => {
    const peer = new SimplePeer({ initiator: true, trickle: false, stream });

    peer.on("signal", (offer) => {
      socket.emit("offer", { roomId, offer });
    });

    peer.on("stream", (userStream) => {
      userVideo.current.srcObject = userStream;
    });

    return peer;
  };

  const answerPeer = (offer, stream) => {
    const peer = new SimplePeer({ initiator: false, trickle: false, stream });

    peer.signal(offer);

    peer.on("signal", (answer) => {
      socket.emit("answer", { roomId, answer });
    });

    peer.on("stream", (userStream) => {
      userVideo.current.srcObject = userStream;
    });

    return peer;
  };

  return (
    <div>
      <h2>Video Call</h2>
      <video ref={myVideo} autoPlay muted />
      <video ref={userVideo} autoPlay />
    </div>
  );
};

export default VideoCall;
