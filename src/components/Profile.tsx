import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  Heart, 
  MessageCircle,
  Camera,
  Edit,
  Save,
  Settings,
  Shield
} from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [interestInput, setInterestInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth/login");
        return;
      }
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error || !data) {
        // Auto-create profile row if missing
        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
        });
        if (!insertError) {
          // Try fetching again
          ({ data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single());
        }
      }
      if (data) {
        setProfile(data);
      } else {
        setProfile(null);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  const handleSaveProfile = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth/login");
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", user.id);
    setSaving(false);
    setIsEditing(false);
    if (!error) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Failed to update profile");
    }
  };

  const addInterest = (interest: string) => {
    if (interest && !profile.interests?.includes(interest)) {
      setProfile((prev: any) => ({
        ...prev,
        interests: [...(prev.interests || []), interest]
      }));
      setInterestInput("");
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setProfile((prev: any) => ({
      ...prev,
      interests: prev.interests.filter((i: string) => i !== interestToRemove)
    }));
  };

  const stats = {
    videoChats: 5,
    matches: 0,
    postsLiked: 156,
    classesRated: 12
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center">Profile not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#7b1113] mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your Iskonek profile and preferences</p>
        </div>

        <div className="space-y-6">
          
          {/* Profile Header */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                
                {/* Avatar Section */}
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-[#7b1113]">
                    <AvatarImage src="/images/josh.jpg" />
                    <AvatarFallback className="bg-[#7b1113] text-white text-3xl">
                      {profile.name ? profile.name.split(' ').map((n: string) => n[0]).join('') : ''}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="sm" 
                    className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-[#7b1113] text-white hover:bg-[#8b1315]"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({...prev, name: e.target.value}))}
                        className="text-xl font-bold"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          value={profile.course}
                          onChange={(e) => setProfile(prev => ({...prev, course: e.target.value}))}
                          placeholder="Course"
                        />
                        <Input
                          value={profile.year}
                          onChange={(e) => setProfile(prev => ({...prev, year: e.target.value}))}
                          placeholder="Year Level"
                        />
                      </div>
                      <Textarea
                        value={profile.bio}
                        onChange={(e) => setProfile(prev => ({...prev, bio: e.target.value}))}
                        placeholder="Tell us about yourself..."
                        className="min-h-[80px]"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h1 className="text-3xl font-bold text-[#7b1113]">{profile.name}</h1>
                      
                      <div className="flex flex-wrap gap-4 justify-center md:justify-start text-gray-600">
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4" />
                          <span>{profile.course}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{profile.year}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{profile.campus}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed max-w-2xl">
                        {profile.bio}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>📧 {profile.email}</span>
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-6 justify-center md:justify-start">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSaveProfile} className="bg-[#7b1113] hover:bg-[#8b1315]">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => setIsEditing(true)} variant="outline" className="border-[#7b1113] text-[#7b1113]">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                        <Button variant="outline" className="border-gray-300 text-gray-700">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#7b1113] mb-1">{stats.videoChats}</div>
                <div className="text-sm text-gray-600">Video Chats</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#7b1113] mb-1">{stats.matches}</div>
                <div className="text-sm text-gray-600">Matches</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#7b1113] mb-1">{stats.postsLiked}</div>
                <div className="text-sm text-gray-600">Posts Liked</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#7b1113] mb-1">{stats.classesRated}</div>
                <div className="text-sm text-gray-600">Classes Rated</div>
              </CardContent>
            </Card>
          </div>

          {/* Interests Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#7b1113] flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Interests & Hobbies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {profile.interests?.map((interest, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-gray-100 text-gray-700 border border-gray-200 relative group"
                    >
                      {interest}
                      {isEditing && (
                        <button
                          onClick={() => removeInterest(interest)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new interest..."
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addInterest(interestInput);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => addInterest(interestInput)}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Social Media Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#7b1113] flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Instagram</label>
                    <Input
                      value={profile.instagram}
                      onChange={(e) => setProfile(prev => ({...prev, instagram: e.target.value}))}
                      placeholder="@username"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Twitter</label>
                    <Input
                      value={profile.twitter}
                      onChange={(e) => setProfile(prev => ({...prev, twitter: e.target.value}))}
                      placeholder="@username"
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {profile.instagram && (
                    <div className="flex items-center gap-2 text-pink-600">
                      <span>📷</span>
                      <span>{profile.instagram}</span>
                    </div>
                  )}
                  {profile.twitter && (
                    <div className="flex items-center gap-2 text-blue-500">
                      <span>🐦</span>
                      <span>{profile.twitter}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Privacy & Safety */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#7b1113] flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Safety
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#7b1113]">Show me in Discovery</h4>
                    <p className="text-sm text-gray-600">Allow others to find you through video chat and dating</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#7b1113]">Distance Visibility</h4>
                    <p className="text-sm text-gray-600">Show your distance to other users</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#7b1113]">Read Receipts</h4>
                    <p className="text-sm text-gray-600">Let others know when you've seen their messages</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
