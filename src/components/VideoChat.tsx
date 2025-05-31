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

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

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

  useEffect(() => {
    if (localVideoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Error accessing media devices:", err);
          toast.error("Unable to access camera/microphone");
        });
    }
  }, []);

  const startSearch = () => {
    setIsSearching(true);
    toast.info("Searching for a fellow Isko/Iska...");
    
    setTimeout(() => {
      setIsSearching(false);
      setIsConnected(true);
      toast.success("Connected to a fellow UP student!");
    }, 3000);
  };

  const endCall = () => {
    setIsConnected(false);
    setShowProfile(false);
    setChatMessages([]);
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#7b1113] mb-2">Video Chat</h1>
          <p className="text-gray-600">Connect with fellow UP students through video chat</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
          
          {/* Main Video Area */}
          <div className="xl:col-span-3 flex flex-col h-full">
            <Card className="flex-1 overflow-hidden border border-gray-200 shadow-sm">
              <CardContent className="p-0 h-full flex flex-col">
                
                {/* Video Container */}
                <div className="relative bg-black flex-1">
                  {/* Remote Video */}
                  <div className="relative h-full">
                    {isConnected ? (
                      <video
                        ref={remoteVideoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                      />
                    ) : (
                      <video
                        ref={localVideoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                        muted
                      />
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
                    <div className="absolute bottom-20 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                      <video
                        ref={localVideoRef}
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
      </div>
    </div>
  );
};

export default VideoChat;
