import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  MessageCircle, 
  User,
  Settings,
  SkipForward,
  Send,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

const VideoChat = () => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{id: number, message: string, sender: 'me' | 'peer'}>>([]);
  const [filters, setFilters] = useState({
    campus: "any",
    interest: "",
    connectionType: "any"
  });

  const localVideoMainRef = useRef<HTMLVideoElement>(null);
  const localVideoPreviewRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const mockPeerProfile = {
    name: "Maria Santos",
    course: "BS Computer Science",
    campus: "UP Diliman",
    year: "3rd Year",
    interests: ["Programming", "Gaming", "Anime"],
    socialMedia: {
      instagram: "@mariasantos_up",
      twitter: "@maria_codes"
    }
  };

  const [roomId, setRoomId] = useState<string | null>(null);
  const [queueId, setQueueId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [peerStream, setPeerStream] = useState<MediaStream | null>(null);

  const rtcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  const supabaseRealtimeRef = useRef<any>(null);

  const [searchingCount, setSearchingCount] = useState(0);

  const [peerName, setPeerName] = useState<string | null>(null);
  const iceCandidateBuffer = useRef<any[]>([]);

  const pollRef = useRef<any>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localStreamRef.current = stream;
        if (localVideoMainRef.current && !isConnected) {
          localVideoMainRef.current.srcObject = stream;
        }
        if (localVideoPreviewRef.current && isConnected) {
          localVideoPreviewRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Error accessing media devices:", err);
        toast.error("Unable to access camera/microphone");
      });
    // Clean up
    return () => {
      localStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    // Attach/detach stream to correct video element on connection change
    if (localStreamRef.current) {
      if (isConnected) {
        if (localVideoPreviewRef.current) {
          localVideoPreviewRef.current.srcObject = localStreamRef.current;
        }
        if (localVideoMainRef.current) {
          localVideoMainRef.current.srcObject = null;
        }
      } else {
        if (localVideoMainRef.current) {
          localVideoMainRef.current.srcObject = localStreamRef.current;
        }
        if (localVideoPreviewRef.current) {
          localVideoPreviewRef.current.srcObject = null;
        }
      }
    }
  }, [isConnected]);

  useEffect(() => {
    // Actually enable/disable video tracks
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = isVideoOn;
      });
    }
  }, [isVideoOn]);

  useEffect(() => {
    // Actually enable/disable audio tracks
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isAudioOn;
      });
    }
  }, [isAudioOn]);

  useEffect(() => {
    // Get current user id
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });
  }, []);

  const cleanupQueue = async (uid = userId) => {
    if (!uid) return;
    await supabase.from('videochat_queue').delete().eq('user_id', uid);
    setQueueId(null);
  };

  useEffect(() => {
    // Cleanup queue on unmount or when not searching
    return () => { cleanupQueue(); };
  }, [userId]);

  useEffect(() => {
    if (!roomId) return;
    const channel = supabase.channel(roomId);
    supabaseRealtimeRef.current = channel;
    channel.on('broadcast', { event: 'signal' }, async (payload) => {
      const { type, data } = payload.payload;
      if (!peerConnectionRef.current) return;
      if (type === 'offer') {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data));
        // Add any buffered ICE candidates
        iceCandidateBuffer.current.forEach(candidate => peerConnectionRef.current!.addIceCandidate(candidate));
        iceCandidateBuffer.current = [];
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        channel.send({ type: 'broadcast', event: 'signal', payload: { type: 'answer', data: answer } });
      } else if (type === 'answer') {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data));
        // Add any buffered ICE candidates
        iceCandidateBuffer.current.forEach(candidate => peerConnectionRef.current!.addIceCandidate(candidate));
        iceCandidateBuffer.current = [];
      } else if (type === 'ice') {
        if (!peerConnectionRef.current.remoteDescription) {
          iceCandidateBuffer.current.push(data);
        } else {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data));
        }
      }
    });
    channel.subscribe();
    return () => { channel.unsubscribe(); };
  }, [roomId]);

  const startPeerConnection = async (roomOverride?: string) => {
    const pc = new RTCPeerConnection(rtcConfig);
    peerConnectionRef.current = pc;
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current!));
    }
    pc.ontrack = (event) => {
      setPeerStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
    pc.onicecandidate = (event) => {
      if (event.candidate && supabaseRealtimeRef.current) {
        supabaseRealtimeRef.current.send({ type: 'broadcast', event: 'signal', payload: { type: 'ice', data: event.candidate } });
      }
    };
    if (!roomOverride || !supabaseRealtimeRef.current) return;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    supabaseRealtimeRef.current.send({ type: 'broadcast', event: 'signal', payload: { type: 'offer', data: offer } });
  };

  const cancelSearch = async () => {
    setIsSearching(false);
    await cleanupQueue(userId);
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const startSearch = async () => {
    setIsSearching(true);
    toast.info("Searching for a fellow Isko/Iska...");
    await cleanupQueue(userId);
    // Add self to queue
    const { data: myEntry, error } = await supabase.from('videochat_queue').insert({ user_id: userId }).select().single();
    setQueueId(myEntry.id);
    // Poll for a match (wait for another user to join and get same room_id)
    pollRef.current = setInterval(async () => {
      // Log all searching users for debugging
      const { data: allSearching } = await supabase.from('videochat_queue').select('*').is('room_id', null);
      console.log('Currently searching:', allSearching);
      const { data: updated } = await supabase.from('videochat_queue').select('*').eq('id', myEntry.id).single();
      if (updated && updated.room_id) {
        // Find peer in the same room
        const { data: peers } = await supabase.from('videochat_queue').select('*').eq('room_id', updated.room_id).neq('user_id', userId);
        if (peers && peers.length > 0) {
          clearInterval(pollRef.current);
          pollRef.current = null;
          setRoomId(updated.room_id);
          setIsSearching(false);
          setIsConnected(true);
          // Fetch peer's name
          const { data: peerProfile } = await supabase.from('profiles').select('name').eq('id', peers[0].user_id).single();
          setPeerName(peerProfile?.name || null);
          await startPeerConnection(updated.room_id);
          toast.success("Connected to a fellow UP student!");
        } else {
          // If room_id is set but no peer found, still update UI and wait for peer
          clearInterval(pollRef.current);
          pollRef.current = null;
          setRoomId(updated.room_id);
          setIsSearching(false);
          setIsConnected(true);
          setPeerName(null);
          await startPeerConnection(updated.room_id);
          toast.success("Waiting for peer to connect...");
        }
      } else {
        // Try to pair with another searching user
        const { data: others } = await supabase.from('videochat_queue').select('*').neq('user_id', userId);
        // 1. If another user has a non-null room_id, join their room
        const peerWithRoom = others && others.find((u: any) => u.room_id);
        if (peerWithRoom && !updated.room_id) {
          await supabase.from('videochat_queue').update({ room_id: peerWithRoom.room_id }).eq('id', myEntry.id);
          // Next poll will pick up the room_id and connect
          return;
        }
        // 2. Otherwise, if another user is searching, pair as before
        const peerSearching = others && others.find((u: any) => !u.room_id);
        if (peerSearching) {
          const newRoomId = `videochat-room-${uuidv4()}`;
          await supabase.from('videochat_queue').update({ room_id: newRoomId }).in('id', [myEntry.id, peerSearching.id]);
          // Next poll will pick up the room_id and connect
        }
      }
    }, 1500);
  };

  const endCall = async () => {
    setIsConnected(false);
    setShowProfile(false);
    setChatMessages([]);
    await cleanupQueue(userId);
    toast.info("Call ended");
  };

  const skipUser = () => {
    setIsConnected(false);
    setShowProfile(false);
    setChatMessages([]);
    startSearch();
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        message: chatMessage,
        sender: 'me'
      }]);
      setChatMessage("");
      
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          message: "Hello there! Nice to meet a fellow UP student!",
          sender: 'peer'
        }]);
      }, 1000);
    }
  };

  const revealMyProfile = () => {
    setShowProfile(!showProfile);
    toast.info(showProfile ? "Profile hidden" : "Profile revealed to peer");
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast.info(isVideoOn ? "Camera off" : "Camera on");
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    toast.info(isAudioOn ? "Microphone muted" : "Microphone unmuted");
  };

  useEffect(() => {
    let interval: any;
    if (isSearching) {
      interval = setInterval(async () => {
        const { count } = await supabase
          .from('videochat_queue')
          .select('*', { count: 'exact', head: true })
          .is('room_id', null);
        setSearchingCount(count || 0);
      }, 2000);
    } else {
      setSearchingCount(0);
    }
    return () => clearInterval(interval);
  }, [isSearching]);

  useEffect(() => {
    // Cleanup polling on unmount
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#7b1113] mb-2">Video Chat</h1>
          <p className="text-gray-600">Connect with fellow UP students through video chat</p>
        </div>
        {isSearching && (
          <div className="text-center text-gray-500 mb-4">
            {searchingCount} {searchingCount === 1 ? 'person' : 'people'} searching...
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
          
          {/* Main Video Area */}
          <div className="xl:col-span-3 flex flex-col h-full">
            <Card className="flex-1 overflow-hidden border border-gray-200 shadow-sm">
              <CardContent className="p-0 h-full flex flex-col">
                
                {/* Video Container */}
                <div className="relative bg-black flex-1">
                  {/* Remote Video */}
                  <div className="relative h-full">
                    {isConnected && peerStream ? (
                      <video
                        ref={remoteVideoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                        style={{ background: '#222' }}
                      />
                    ) : !isConnected ? (
                      <video
                        ref={localVideoMainRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                        muted
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900">
                        <span className="text-white text-2xl">Waiting for peer video...</span>
                      </div>
                    )}
                    {isConnected && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white text-black">Peer</Badge>
                      </div>
                    )}
                    {!isConnected && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-[#7b1113] text-white">You</Badge>
                      </div>
                    )}
                  </div>
                  
                  {/* Local Video Preview (only show when connected) */}
                  {isConnected && (
                    <div className="absolute bottom-20 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-white shadow-lg bg-black">
                      <video
                        ref={localVideoPreviewRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                        muted
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-[#7b1113] text-white">You</Badge>
                      </div>
                    </div>
                  )}
                  {/* Floating Control Bar */}
                  <div className="absolute left-1/2 bottom-6 -translate-x-1/2 flex gap-4 items-center bg-black/80 rounded-full px-6 py-3 shadow-lg z-20">
                    <Button
                      variant={isVideoOn ? "secondary" : "destructive"}
                      size="lg"
                      onClick={toggleVideo}
                      className="rounded-full w-12 h-12 p-0"
                    >
                      {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </Button>
                    <Button
                      variant={isAudioOn ? "secondary" : "destructive"}
                      size="lg"
                      onClick={toggleAudio}
                      className="rounded-full w-12 h-12 p-0"
                    >
                      {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>
                    {!isConnected && !isSearching && (
                      <Button
                        onClick={startSearch}
                        size="lg"
                        className="bg-[#7b1113] text-white hover:bg-[#6a0e10] px-8"
                      >
                        Start Chatting
                      </Button>
                    )}
                    {isConnected && (
                      <>
                        <Button
                          variant="destructive"
                          size="lg"
                          onClick={endCall}
                          className="rounded-full w-12 h-12 p-0"
                        >
                          <Phone className="w-5 h-5" />
                        </Button>
                        
                        <Button
                          onClick={skipUser}
                          size="lg"
                          variant="secondary"
                          className="rounded-full w-12 h-12 p-0"
                        >
                          <SkipForward className="w-5 h-5" />
                        </Button>

                        <Button
                          onClick={revealMyProfile}
                          className="bg-[#7b1113] hover:bg-[#6a0e10] text-white"
                        >
                          <User className="w-4 h-4 mr-2" />
                          {showProfile ? "Hide My Profile" : "Reveal My Profile"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Fixed Height */}
          <div className="h-full flex flex-col space-y-4">
            
            {/* Filters */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-[#7b1113] flex items-center gap-2 text-lg">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Campus</label>
                  <select 
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#7b1113] focus:border-[#7b1113] bg-white"
                    value={filters.campus}
                    onChange={(e) => setFilters({...filters, campus: e.target.value})}
                  >
                    <option value="any">Any Campus</option>
                    <option value="diliman">UP Diliman</option>
                    <option value="lb">UP Los Baños</option>
                    <option value="manila">UP Manila</option>
                    <option value="cebu">UP Cebu</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Connection Type</label>
                  <select 
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#7b1113] focus:border-[#7b1113] bg-white"
                    value={filters.connectionType}
                    onChange={(e) => setFilters({...filters, connectionType: e.target.value})}
                  >
                    <option value="any">Any</option>
                    <option value="study">Study Buddy</option>
                    <option value="dating">Dating</option>
                    <option value="casual">Casual Chat</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Interest Tags</label>
                  <Input 
                    placeholder="#Math21Study, #UPFair"
                    value={filters.interest}
                    onChange={(e) => setFilters({...filters, interest: e.target.value})}
                    className="focus:ring-2 focus:ring-[#7b1113] focus:border-[#7b1113] border-gray-200"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Chat - Takes remaining space */}
            <Card className="flex-1 border border-gray-200 shadow-sm flex flex-col">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-[#7b1113] flex items-center gap-2 text-lg">
                  <MessageCircle className="w-5 h-5" />
                  Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                
                {/* Chat Messages - Scrollable */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50">
                  {chatMessages.length === 0 ? (
                    <p className="text-gray-500 text-center text-sm py-8">Start a conversation...</p>
                  ) : (
                    <div className="space-y-3">
                      {chatMessages.map((msg) => (
                        <div 
                          key={msg.id}
                          className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                            msg.sender === 'me' 
                              ? 'bg-[#7b1113] text-white' 
                              : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                          }`}>
                            {msg.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Chat Input - Fixed at bottom */}
                <div className="p-4 border-t border-gray-100 bg-white">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      disabled={!isConnected}
                      className="focus:ring-2 focus:ring-[#7b1113] focus:border-[#7b1113] border-gray-200"
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={!isConnected || !chatMessage.trim()}
                      className="bg-[#7b1113] hover:bg-[#6a0e10] text-white px-4"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Show peer name when connected */}
        {isConnected && peerName && (
          <div className="text-center text-lg text-[#7b1113] font-semibold mb-2">
            Connected to {peerName}
          </div>
        )}

        {/* Cancel Search button */}
        {isSearching && (
          <div className="text-center mb-4">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
              onClick={cancelSearch}
            >
              Cancel Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoChat;
