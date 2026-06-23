import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/chatpage.css";

const socket = io("https://hospitalmanagementsystem-nz84.onrender.com", {
  transports: ["websocket"],
});

const ChatPage = () => {
  const BASE_URL = "https://hospitalmanagementsystem-nz84.onrender.com";
  const { appointmentId } = useParams();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user._id || localStorage.getItem("userId");
  const role = user.role || localStorage.getItem("role");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [appointment, setAppointment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [callStarted, setCallStarted] = useState(false);
  const [showCallScreen, setShowCallScreen] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isRinging, setIsRinging] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);

  const headers = { role };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          appointmentId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.current = pc;
    return pc;
  };

  const endCall = (notify = true) => {
    if (notify) {
      socket.emit("end-call", { appointmentId });
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setCallStarted(false);
    setShowCallScreen(false);
    setIncomingCall(null);
    setIsRinging(false);
  };

  const startVideoCall = async () => {
    try {
      setShowCallScreen(true);
      setIsRinging(true);
      setIncomingCall(null);

      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
      }

      const pc = createPeerConnection();

      localStream.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStream.current);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("call-user", {
        appointmentId,
        from: userId,
        offer,
      });

      setCallStarted(true);
    } catch (error) {
      console.log(error);
      alert("Camera or microphone permission denied");
      endCall(false);
    }
  };

  const acceptCall = async () => {
    if (!incomingCall) return;

    try {
      setIsRinging(false);

      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
      }

      const pc = createPeerConnection();

      localStream.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStream.current);
      });

      await pc.setRemoteDescription(
        new RTCSessionDescription(incomingCall.offer)
      );

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer-call", {
        appointmentId,
        from: userId,
        answer,
      });

      setCallStarted(true);
      setIncomingCall(null);
    } catch (error) {
      console.log(error);
      alert("Camera or microphone permission denied");
      endCall(false);
    }
  };

  const rejectCall = () => {
    socket.emit("reject-call", { appointmentId });
    endCall(false);
  };

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/appointments/chat/${appointmentId}`,
        { headers }
      );

      setMessages(data.messages || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAppointment = async () => {
    try {
      let endpoint = "";

      if (role === "patient") {
        endpoint = `${BASE_URL}/api/appointments/patient/${userId}`;
      } else {
        const doctorId = localStorage.getItem("doctorId");
        endpoint = `${BASE_URL}/api/appointments/doctor/${doctorId}`;
      }

      const { data } = await axios.get(endpoint, { headers });

      const found = data.appointments?.find(
        (a) => a._id === appointmentId
      );

      setAppointment(found);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.emit("joinAppointment", appointmentId);

    fetchMessages();
    fetchAppointment();

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("incoming-call", (data) => {
      setIncomingCall(data);
      setShowCallScreen(true);
      setIsRinging(true);
    });

    socket.on("call-answered", async (data) => {
      setIsRinging(false);
      setIncomingCall(null);
      setCallStarted(true);

      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      }
    });

    socket.on("ice-candidate", async (data) => {
      if (peerConnection.current && data.candidate) {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      }
    });

    socket.on("call-rejected", () => {
      alert("Call rejected");
      endCall(false);
    });

    socket.on("call-ended", () => {
      endCall(false);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("incoming-call");
      socket.off("call-answered");
      socket.off("ice-candidate");
      socket.off("call-rejected");
      socket.off("call-ended");
    };
  }, [appointmentId]);

  const getReceiverId = () => {
    if (!appointment) return null;

    if (role === "patient") {
      return appointment.doctorId?.userId?._id;
    }

    return appointment.patientId?._id;
  };

  const sendMessage = () => {
    if (!text.trim()) return;

    const receiverId = getReceiverId();

    if (!receiverId) {
      return alert("Receiver not found");
    }

    socket.emit("sendMessage", {
      appointmentId,
      senderId: userId,
      receiverId,
      message: text,
    });

    setText("");
  };

  const uploadFile = async () => {
    try {
      if (!selectedFile) {
        return alert("Please select a file");
      }

      const receiverId = getReceiverId();

      if (!receiverId) {
        return alert("Receiver not found");
      }

      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("appointmentId", appointmentId);
      formData.append("senderId", userId);
      formData.append("receiverId", receiverId);

      await axios.post(
        `${BASE_URL}/api/appointments/chat/upload`,
        formData,
        {
          headers: {
            role,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSelectedFile(null);
      fetchMessages();

      alert("File sent successfully");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "File upload failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="chat-page">
        <div className="chat-container">
          <div className="chat-header">
            <div>
              <h2>Online Consultation</h2>
              <p>Chat, share files, and start video consultation.</p>
            </div>

            <button
              className="start-call-main-btn"
              onClick={startVideoCall}
              disabled={callStarted}
            >
              📹 Video Call
            </button>
          </div>

          {showCallScreen && (
            <div className="call-fullscreen">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="remote-video"
              />

              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="local-video"
              />

              {isRinging && incomingCall && (
                <div className="ringing-box">
                  <h2>Incoming Video Call</h2>
                  <p>Doctor/Patient is calling...</p>

                  <div className="ringing-actions">
                    <button
                      className="accept-call-btn"
                      onClick={acceptCall}
                    >
                      Accept
                    </button>

                    <button
                      className="reject-call-btn"
                      onClick={rejectCall}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {isRinging && !incomingCall && (
                <div className="ringing-box">
                  <h2>Calling...</h2>
                  <p>Please wait for receiver to accept</p>
                </div>
              )}

              <div className="call-bottom-controls">
                <button
                  className="end-call-btn"
                  onClick={() => endCall(true)}
                >
                  📞 End Call
                </button>
              </div>
            </div>
          )}

          <div className="chat-messages">
            {messages.length === 0 ? (
              <p className="empty-chat">No messages yet</p>
            ) : (
              messages.map((msg, index) => {
                const sender =
                  typeof msg.senderId === "object"
                    ? msg.senderId._id
                    : msg.senderId;

                return (
                  <div
                    key={msg._id || index}
                    className={
                      sender === userId
                        ? "message mine"
                        : "message other"
                    }
                  >
                    {msg.message && <p>{msg.message}</p>}

                    {msg.fileType === "image" && (
                      <img
                        src={`${BASE_URL}${msg.fileUrl}`}
                        alt="chat-file"
                        className="chat-image"
                      />
                    )}

                    {msg.fileType && msg.fileType !== "image" && (
                      <a
                        href={`${BASE_URL}${msg.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="file-link"
                      >
                        📎 {msg.fileName || "Download File"}
                      </a>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="chat-input-box">
            <input
              type="text"
              placeholder="Type message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button onClick={sendMessage}>Send</button>
          </div>

          <div className="file-upload-box">
            <input
              type="file"
              onChange={(e) =>
                setSelectedFile(e.target.files[0])
              }
            />

            <button onClick={uploadFile}>Upload File</button>
          </div>

          {selectedFile && (
            <p className="selected-file">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;
