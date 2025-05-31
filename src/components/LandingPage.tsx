import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Video, 
  Heart, 
  MessageSquare, 
  BookOpen, 
  Shield, 
  Users,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const LandingPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setLoggedIn(!!user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-20 mb-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img 
                src="/images/1.png" 
                alt="Iskonek Hero" 
                className="w-100 h-50 object-contain"
              />
            </div>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The exclusive social platform connecting UP students across all campuses. 
              Chat, date, share, and learn with fellow Iskos and Iskas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              {loggedIn ? (
                <>
                  <Link to="/video-chat">
                    <Button size="lg" className="bg-[#7b1113] text-white hover:bg-[#8b1315] text-lg px-8 py-4 rounded-full">
                      <Video className="w-5 h-5 mr-2" />
                      Start Video Chat
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/dating">
                    <Button size="lg" variant="outline" className="border-[#7b1113] text-[#7b1113] hover:bg-[#7b1113] hover:text-white text-lg px-8 py-4 rounded-full">
                      <Heart className="w-5 h-5 mr-2" />
                      Find Your Match
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth/login">
                    <Button size="lg" className="bg-[#7b1113] text-white hover:bg-[#8b1315] text-lg px-8 py-4 rounded-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/auth/signup">
                    <Button size="lg" variant="outline" className="border-[#7b1113] text-[#7b1113] hover:bg-[#7b1113] hover:text-white text-lg px-8 py-4 rounded-full">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Shield className="w-4 h-4" />
              <span className="text-sm">@up.edu.ph verification required • UP students only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#7b1113] mb-4">
              Everything UP Students Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From anonymous confessions to finding your perfect study buddy or life partner
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Video Chat Feature */}
            <Card className="hover:shadow-lg transition-shadow bg-white border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-[#7b1113] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-[#7b1113] text-lg">Video Chat</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4 text-sm">
                  Meet random UP students through video chat. Filter by campus, interests, and connection type.
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2" />Campus filtering</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2" />Interest-based matching</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2" />Profile reveal option</li>
                </ul>
              </CardContent>
            </Card>

            {/* Dating Feature */}
            <Card className="hover:shadow-lg transition-shadow bg-white border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-[#7b1113] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-[#7b1113] text-lg">Dating</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4 text-sm">
                  Swipe to find your perfect match among fellow UP students. Super likes and crush roulette included.
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2" />Swipe mechanics</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2" />Mutual matching</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2" />Super likes</li>
                </ul>
              </CardContent>
            </Card>

            {/* Freedom Wall Feature */}
            <Card className="hover:shadow-lg transition-shadow bg-white border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-[#7b1113] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-[#7b1113] text-lg">Freedom Wall</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4 text-sm">
                  Share confessions, thoughts, and experiences. Post anonymously or with your name.
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2" />Anonymous posting</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2" />Like & comment system</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2" />Content moderation</li>
                </ul>
              </CardContent>
            </Card>

            {/* Class Ratings Feature */}
            <Card className="hover:shadow-lg transition-shadow bg-white border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-[#7b1113] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-[#7b1113] text-lg">Class Ratings</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4 text-sm">
                  Rate professors and courses to help fellow students make informed decisions.
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2" />Professor ratings</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2" />Difficulty levels</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2" />Course reviews</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Safety Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Shield className="w-16 h-16 mx-auto mb-6 text-[#7b1113]" />
            <h2 className="text-4xl font-bold text-[#7b1113] mb-4">
              Safety & Moderation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your safety is our priority. We maintain a secure environment for all UP students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#7b1113] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#7b1113] mb-2">UP-Only Access</h3>
              <p className="text-gray-600">
                Exclusive to @up.edu.ph email addresses. Only verified UP students can join.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#7b1113] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#7b1113] mb-2">Three-Strike System</h3>
              <p className="text-gray-600">
                Fair moderation with warnings, temporary bans, and UP admin notifications for violations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#7b1113] rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#7b1113] mb-2">AI Content Filtering</h3>
              <p className="text-gray-600">
                Advanced AI scans images and text to prevent harassment and inappropriate content.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-[#7b1113]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Connect with UP?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of Iskos and Iskas already using Iskonek to build meaningful connections.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#7b1113] hover:bg-gray-100 text-lg px-8 py-4 rounded-full">
              Sign Up with UP Email
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#7b1113] text-lg px-8 py-4 rounded-full">
              Learn More
            </Button>
          </div>

          <p className="text-sm text-gray-300 mt-6">
            By signing up, you agree to our Terms of Service and Community Guidelines
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
