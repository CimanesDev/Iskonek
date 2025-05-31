
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  X, 
  Star, 
  MessageCircle, 
  MapPin, 
  GraduationCap,
  Instagram,
  Twitter,
  Zap
} from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: number;
  name: string;
  age: number;
  course: string;
  campus: string;
  year: string;
  bio: string;
  interests: string[];
  images: string[];
  distance: string;
  isOnline: boolean;
  socialMedia: {
    instagram?: string;
    twitter?: string;
  };
}

const Dating = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [matches, setMatches] = useState<Profile[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const profiles: Profile[] = [
    {
      id: 1,
      name: "Albert Caro",
      age: 20,
      course: "BS Computer Science",
      campus: "UP Manila",
      year: "2nd Year",
      bio: "CODERZZZ",
      interests: ["Coding", "Studying", "Wildrift"],
      images: ["/images/albert.jpg"],
      distance: "2 km away",
      isOnline: true,
      socialMedia: {
        instagram: "@abetcaro"
      }
    },
    {
      id: 2,
      name: "Dale Yuan De Guzman",
      age: 20,
      course: "BS Computer Science",
      campus: "UP Manila",
      year: "2nd Year",
      bio: "Crush ng Bayan",
      interests: ["Mangchix", "Kumain", "CODM"],
      images: ["/images/dale.jpg"],
      distance: "10 km away",
      isOnline: false,
      socialMedia: {
        instagram: "@dalegzmn",
      }
    },
    {
      id: 3,
      name: "Josh Cimanes",
      age: 19,
      course: "BS Computer Science",
      campus: "UP Manila",
      year: "2nd Year",
      bio: "Taken na ni Rizamae Obias",
      interests: ["I", "love", "Rizamae"],
      images: ["/images/josh.jpg"],
      distance: "3 km away",
      isOnline: true,
      socialMedia: {
        instagram: "@cimanesjoshbradley"
      }
    }
  ];

  const currentProfile = profiles[currentIndex];

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (!currentProfile) return;

    if (direction === 'right') {
      toast.success(`You liked ${currentProfile.name}!`);
      if (Math.random() > 0.7) {
        setMatches(prev => [...prev, currentProfile]);
        toast.success(`🎉 It's a match with ${currentProfile.name}!`);
      }
    } else if (direction === 'up') {
      toast.success(`You super liked ${currentProfile.name}! ⭐`);
      if (Math.random() > 0.5) {
        setMatches(prev => [...prev, currentProfile]);
        toast.success(`🎉 It's a match with ${currentProfile.name}!`);
      }
    } else {
      toast.info(`You passed on ${currentProfile.name}`);
    }

    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % profiles.length);
      setDragOffset({ x: 0, y: 0 });
    }, 300);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2
    });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragOffset.x) > 100) {
      handleSwipe(dragOffset.x > 0 ? 'right' : 'left');
    } else if (dragOffset.y < -100) {
      handleSwipe('up');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-96 border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-[#7b1113]" />
            <h2 className="text-xl font-bold text-[#7b1113] mb-2">No more profiles!</h2>
            <p className="text-gray-600">Check back later for more Iskos and Iskas.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#7b1113] mb-2">Dating</h1>
          <p className="text-gray-600">Find your perfect match among fellow UP students</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Card Stack */}
          <div className="lg:col-span-3 flex justify-center items-start">
            <div className="relative w-full max-w-md">
              
              {/* Background Cards */}
              <div className="absolute inset-0 transform rotate-2 scale-95 opacity-30">
                <Card className="w-full h-[600px] bg-gray-200 border-0"></Card>
              </div>
              <div className="absolute inset-0 transform -rotate-1 scale-97 opacity-60">
                <Card className="w-full h-[600px] bg-gray-100 border-0"></Card>
              </div>

              {/* Main Card */}
              <Card
                ref={cardRef}
                className={`relative w-full h-[600px] border-0 shadow-xl cursor-grab overflow-hidden transition-transform duration-300 ${
                  isDragging ? 'cursor-grabbing scale-105' : ''
                }`}
                style={{
                  transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`,
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Profile Image */}
                <div className="relative h-96 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                  <img
                    src={currentProfile.images[0]}
                    alt={currentProfile.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Online Status */}
                  {currentProfile.isOnline && (
                    <div className="absolute top-4 right-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  )}

                  {/* Swipe Indicators */}
                  {isDragging && (
                    <>
                      <div 
                        className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                          dragOffset.x > 50 ? 'opacity-80' : 'opacity-0'
                        }`}
                        style={{ backgroundColor: 'rgba(34, 197, 94, 0.8)' }}
                      >
                        <div className="text-white text-4xl font-bold transform rotate-12 border-4 border-white px-6 py-2 rounded-lg">
                          LIKE
                        </div>
                      </div>
                      <div 
                        className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                          dragOffset.x < -50 ? 'opacity-80' : 'opacity-0'
                        }`}
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }}
                      >
                        <div className="text-white text-4xl font-bold transform -rotate-12 border-4 border-white px-6 py-2 rounded-lg">
                          NOPE
                        </div>
                      </div>
                      <div 
                        className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                          dragOffset.y < -50 ? 'opacity-80' : 'opacity-0'
                        }`}
                        style={{ backgroundColor: 'rgba(59, 130, 246, 0.8)' }}
                      >
                        <div className="text-white text-3xl font-bold border-4 border-white px-6 py-2 rounded-lg flex items-center gap-2">
                          <Star className="w-8 h-8 fill-current" />
                          SUPER LIKE
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Profile Info */}
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-[#7b1113]">
                          {currentProfile.name}, {currentProfile.age}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <GraduationCap className="w-4 h-4" />
                          <span className="text-sm">{currentProfile.course}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{currentProfile.campus} • {currentProfile.year}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        {currentProfile.distance}
                      </Badge>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed">
                      {currentProfile.bio}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {currentProfile.interests.map((interest, index) => (
                        <Badge key={index} variant="outline" className="border-gray-300 text-gray-700">
                          {interest}
                        </Badge>
                      ))}
                    </div>

                    {/* Social Media */}
                    <div className="flex items-center gap-3">
                      {currentProfile.socialMedia.instagram && (
                        <div className="flex items-center gap-1 text-pink-600">
                          <Instagram className="w-4 h-4" />
                          <span className="text-xs">{currentProfile.socialMedia.instagram}</span>
                        </div>
                      )}
                      {currentProfile.socialMedia.twitter && (
                        <div className="flex items-center gap-1 text-blue-500">
                          <Twitter className="w-4 h-4" />
                          <span className="text-xs">{currentProfile.socialMedia.twitter}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-center items-center gap-6 mt-6">
                <Button
                  variant="destructive"
                  size="lg"
                  className="rounded-full w-14 h-14 p-0 shadow-lg"
                  onClick={() => handleSwipe('left')}
                >
                  <X className="w-6 h-6" />
                </Button>
                
                <Button
                  size="lg"
                  className="rounded-full w-14 h-14 p-0 bg-blue-500 hover:bg-blue-600 shadow-lg"
                  onClick={() => handleSwipe('up')}
                >
                  <Star className="w-6 h-6 fill-current" />
                </Button>
                
                <Button
                  size="lg"
                  className="rounded-full w-14 h-14 p-0 bg-green-500 hover:bg-green-600 shadow-lg"
                  onClick={() => handleSwipe('right')}
                >
                  <Heart className="w-6 h-6 fill-current" />
                </Button>
              </div>
            </div>
          </div>

          {/* Matches Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-[#7b1113] mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Your Matches ({matches.length})
                </h3>
                
                {matches.length === 0 ? (
                  <p className="text-gray-500 text-center text-sm py-8">
                    No matches yet. Keep swiping!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {matches.map((match) => (
                      <div key={match.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <img
                          src={match.images[0]}
                          alt={match.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-[#7b1113] truncate">
                            {match.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {match.course}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost" className="p-2">
                          <MessageCircle className="w-4 h-4 text-[#7b1113]" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Crush Roulette */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-[#7b1113] mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Crush Roulette
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  See who liked you! Get higher match chances with mutual connections.
                </p>
                <Button className="w-full bg-[#7b1113] text-white hover:bg-[#8b1315]">
                  <Zap className="w-4 h-4 mr-2" />
                  Reveal Crushes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dating;
