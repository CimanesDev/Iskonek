import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Video, 
  MessageSquare, 
  Heart, 
  BookOpen, 
  User, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/video-chat", icon: Video, label: "Video Chat" },
    { path: "/dating", icon: Heart, label: "Dating" },
    { path: "/freedom-wall", icon: MessageSquare, label: "Freedom Wall" },
    { path: "/class-ratings", icon: BookOpen, label: "Class Ratings" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/images/1.png" 
                alt="Iskonek Logo" 
                className="w-50 h-10"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? "bg-[#7b1113] text-white"
                    : "text-gray-600 hover:text-[#7b1113] hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback className="bg-[#7b1113] text-white text-xs">UP</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-[#7b1113] hover:bg-gray-50 p-2"
                onClick={async (e) => {
                  e.preventDefault();
                  await supabase.auth.signOut();
                  window.location.href = "/";
                }}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium ${
                    isActive(item.path)
                      ? "bg-[#7b1113] text-white"
                      : "text-gray-600 hover:text-[#7b1113] hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
