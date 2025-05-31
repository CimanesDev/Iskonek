
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Flag, 
  Eye, 
  EyeOff, 
  Send,
  Filter,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

interface Post {
  id: number;
  content: string;
  author: string;
  isAnonymous: boolean;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  campus: string;
  category: string;
}

const FreedomWall = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      content: "Confession: I've been crushing on this person in my Math 21 class for 2 months now but I'm too shy to approach them. They always sit in the front row and ask really smart questions. How do I even start a conversation? 😭",
      author: "Anonymous Isko",
      isAnonymous: true,
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      isLiked: false,
      campus: "UP Diliman",
      category: "Confession"
    },
    {
      id: 2,
      content: "Looking for someone to be my date for UP Fair! I'm a 3rd year BS Biology student. Let's explore the fair together and maybe grab some UP Diliman famous palabok? DM me! 🎡",
      author: "Maria Santos",
      isAnonymous: false,
      timestamp: "4 hours ago",
      likes: 15,
      comments: 12,
      isLiked: true,
      campus: "UP Diliman",
      category: "Dating"
    },
    {
      id: 3,
      content: "That moment when you realize you've been attending the wrong class for 3 weeks because you misread your schedule 🤦‍♀️ College life hits different. At least the prof was nice about it!",
      author: "Luna Valdez",
      isAnonymous: false,
      timestamp: "6 hours ago",
      likes: 89,
      comments: 23,
      isLiked: false,
      campus: "UP Diliman",
      category: "College Life"
    },
    {
      id: 4,
      content: "Study group for Econ 11 anyone? Finals are coming up and I'm literally drowning in theories. We can meet at the lib or AS steps. Bring coffee and prayers 📚☕",
      author: "Anonymous",
      isAnonymous: true,
      timestamp: "8 hours ago",
      likes: 12,
      comments: 6,
      isLiked: false,
      campus: "UP Diliman",
      category: "Academic"
    }
  ]);

  const [newPost, setNewPost] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Confession");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["Confession", "Dating", "Academic", "College Life", "Random"];

  const handleSubmitPost = () => {
    if (!newPost.trim()) {
      toast.error("Please write something first!");
      return;
    }

    const post: Post = {
      id: posts.length + 1,
      content: newPost,
      author: isAnonymous ? "Anonymous" : "You",
      isAnonymous,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      isLiked: false,
      campus: "UP Diliman",
      category: selectedCategory
    };

    setPosts([post, ...posts]);
    setNewPost("");
    toast.success("Post shared to the freedom wall!");
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleReport = (postId: number) => {
    toast.info("Post reported. Our moderators will review it within 24 hours.");
  };

  const filteredPosts = filterCategory === "All" 
    ? posts 
    : posts.filter(post => post.category === filterCategory);

  const trendingTopics = [
    "#UPFair2024",
    "#Math21Struggle", 
    "#ASSteps",
    "#UPLibLife",
    "#CrushAtUP",
    "#UPConfessions"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#7b1113] mb-2">Freedom Wall</h1>
          <p className="text-gray-600">Share your thoughts, confessions, and experiences with fellow UP students</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Create Post */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#7b1113] flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Share to Freedom Wall
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <select 
                    className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-[#7b1113] focus:border-transparent"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <Button
                    variant={isAnonymous ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={isAnonymous ? "bg-[#7b1113] hover:bg-[#8b1315]" : "border-[#7b1113] text-[#7b1113]"}
                  >
                    {isAnonymous ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {isAnonymous ? "Anonymous" : "Show Name"}
                  </Button>
                </div>
                
                <Textarea
                  placeholder="What's on your mind, Isko/Iska? Share your thoughts, confessions, or anything about UP life..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[100px] resize-none focus:ring-2 focus:ring-[#7b1113] focus:border-transparent"
                />
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {isAnonymous ? "Posting anonymously" : "Posting as yourself"}
                  </p>
                  <Button 
                    onClick={handleSubmitPost}
                    className="bg-[#7b1113] text-white hover:bg-[#8b1315]"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.isAnonymous ? undefined : "/api/placeholder/40/40"} />
                        <AvatarFallback className="bg-[#7b1113] text-white">
                          {post.isAnonymous ? "?" : post.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-[#7b1113]">
                            {post.author}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {post.category}
                          </Badge>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{post.timestamp}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{post.campus}</span>
                        </div>
                        
                        <p className="text-gray-800 mb-4 leading-relaxed">
                          {post.content}
                        </p>
                        
                        <div className="flex items-center gap-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className={`gap-2 ${post.isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                          >
                            <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                            {post.likes}
                          </Button>
                          
                          <Button variant="ghost" size="sm" className="gap-2 text-gray-500 hover:text-[#7b1113]">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReport(post.id)}
                            className="gap-2 text-gray-500 hover:text-orange-500 ml-auto"
                          >
                            <Flag className="w-4 h-4" />
                            Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Filters */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#7b1113] flex items-center gap-2 text-lg">
                  <Filter className="w-4 h-4" />
                  Filter Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={filterCategory === "All" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilterCategory("All")}
                    className={`w-full justify-start ${filterCategory === "All" ? 'bg-[#7b1113]' : ''}`}
                  >
                    All Posts
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={filterCategory === category ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFilterCategory(category)}
                      className={`w-full justify-start ${filterCategory === category ? 'bg-[#7b1113]' : ''}`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#7b1113] flex items-center gap-2 text-lg">
                  <TrendingUp className="w-4 h-4" />
                  Trending at UP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between py-1">
                      <span className="text-sm font-medium text-[#7b1113] cursor-pointer hover:underline">
                        {topic}
                      </span>
                      <TrendingUp className="w-3 h-3 text-[#7b1113]" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#7b1113] text-lg">
                  Community Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Be respectful to fellow Iskos and Iskas</p>
                  <p>• No hate speech or discrimination</p>
                  <p>• Report inappropriate content</p>
                  <p>• Keep discussions UP-related</p>
                  <p>• Three-strike moderation system</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreedomWall;
