
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Search, 
  Plus, 
  BookOpen, 
  User, 
  Calendar,
  TrendingUp,
  Filter
} from "lucide-react";
import { toast } from "sonner";

interface ClassRating {
  id: number;
  courseCode: string;
  courseName: string;
  professor: string;
  difficulty: number;
  rating: number;
  review: string;
  semester: string;
  department: string;
  campus: string;
  reviewer: string;
  isAnonymous: boolean;
  timestamp: string;
  helpful: number;
}

const ClassRatings = () => {
  const [ratings, setRatings] = useState<ClassRating[]>([
    {
      id: 1,
      courseCode: "Math 21",
      courseName: "Basic Calculus",
      professor: "Dr. Maria Garcia",
      difficulty: 4,
      rating: 5,
      review: "Dr. Garcia is amazing! She explains calculus concepts very clearly and provides lots of examples. Her exams are fair and she's always willing to help during consultation hours. Highly recommend!",
      semester: "2nd Sem 2023-2024",
      department: "Mathematics",
      campus: "UP Diliman",
      reviewer: "Anonymous",
      isAnonymous: true,
      timestamp: "2 weeks ago",
      helpful: 24
    },
    {
      id: 2,
      courseCode: "CS 11",
      courseName: "Introduction to Computer Science",
      professor: "Prof. John Santos",
      difficulty: 3,
      rating: 4,
      review: "Great introduction to programming! Prof. Santos makes coding fun and accessible even for beginners. The machine problems are challenging but doable. Just make sure to start early!",
      semester: "1st Sem 2023-2024",
      department: "Computer Science",
      campus: "UP Diliman",
      reviewer: "TechGirl2024",
      isAnonymous: false,
      timestamp: "1 month ago",
      helpful: 18
    },
    {
      id: 3,
      courseCode: "Kas 1",
      courseName: "Kasaysayan ng Pilipinas",
      professor: "Dr. Rosa Mendoza",
      difficulty: 2,
      rating: 3,
      review: "Interesting subject matter but the professor can be quite strict with attendance. Reading assignments are heavy but the discussions are engaging. Midterm exam was surprisingly difficult.",
      semester: "2nd Sem 2023-2024",
      department: "History",
      campus: "UP Diliman",
      reviewer: "HistoryBuff",
      isAnonymous: false,
      timestamp: "3 weeks ago",
      helpful: 12
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  
  const [newRating, setNewRating] = useState({
    courseCode: "",
    courseName: "",
    professor: "",
    difficulty: 0,
    rating: 0,
    review: "",
    semester: "",
    department: "",
    isAnonymous: true
  });

  const departments = [
    "All", "Mathematics", "Computer Science", "Psychology", "History", 
    "English", "Biology", "Chemistry", "Physics", "Economics"
  ];

  const renderStars = (rating: number, size: "sm" | "lg" = "sm", interactive: boolean = false, onRate?: (rating: number) => void) => {
    const starSize = size === "sm" ? "w-4 h-4" : "w-6 h-6";
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating 
                ? "text-[#FFD700] fill-current" 
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-[#FFD700]" : ""}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  const handleSubmitRating = () => {
    if (!newRating.courseCode || !newRating.professor || !newRating.review || newRating.rating === 0) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const rating: ClassRating = {
      id: ratings.length + 1,
      ...newRating,
      campus: "UP Diliman",
      reviewer: newRating.isAnonymous ? "Anonymous" : "You",
      timestamp: "Just now",
      helpful: 0
    };

    setRatings([rating, ...ratings]);
    setNewRating({
      courseCode: "",
      courseName: "",
      professor: "",
      difficulty: 0,
      rating: 0,
      review: "",
      semester: "",
      department: "",
      isAnonymous: true
    });
    setShowAddForm(false);
    toast.success("Class rating submitted!");
  };

  const filteredRatings = ratings
    .filter(rating => {
      const matchesSearch = 
        rating.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rating.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rating.courseName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = filterDepartment === "All" || rating.department === filterDepartment;
      return matchesSearch && matchesDepartment;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "difficulty") return b.difficulty - a.difficulty;
      if (sortBy === "helpful") return b.helpful - a.helpful;
      return 0; // recent is default order
    });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Header & Search */}
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="border-b border-gray-50">
                <CardTitle className="text-[#7b1113] flex items-center gap-3 text-2xl font-bold">
                  <BookOpen className="w-7 h-7" />
                  Class Ratings & Reviews
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Help fellow Iskos and Iskas choose their classes wisely!
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search by course code, professor, or subject..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-[#7b1113] focus:ring-[#7b1113]"
                    />
                  </div>
                  <Button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-[#7b1113] hover:bg-[#6a0e10] text-white h-12 px-6"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Rating
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <select 
                    className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-[#7b1113] focus:ring-[#7b1113] bg-white"
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  
                  <select 
                    className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-[#7b1113] focus:ring-[#7b1113] bg-white"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="rating">Highest Rated</option>
                    <option value="difficulty">Most Difficult</option>
                    <option value="helpful">Most Helpful</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Add Rating Form */}
            {showAddForm && (
              <Card className="border border-gray-100 shadow-sm">
                <CardHeader className="border-b border-gray-50">
                  <CardTitle className="text-[#7b1113] text-xl font-semibold">Add Class Rating</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Course Code *</label>
                        <Input
                          placeholder="e.g., Math 21"
                          value={newRating.courseCode}
                          onChange={(e) => setNewRating({...newRating, courseCode: e.target.value})}
                          className="border-gray-200 focus:border-[#7b1113] focus:ring-[#7b1113]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Course Name</label>
                        <Input
                          placeholder="e.g., Basic Calculus"
                          value={newRating.courseName}
                          onChange={(e) => setNewRating({...newRating, courseName: e.target.value})}
                          className="border-gray-200 focus:border-[#7b1113] focus:ring-[#7b1113]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Professor *</label>
                        <Input
                          placeholder="e.g., Dr. Juan Cruz"
                          value={newRating.professor}
                          onChange={(e) => setNewRating({...newRating, professor: e.target.value})}
                          className="border-gray-200 focus:border-[#7b1113] focus:ring-[#7b1113]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Department</label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-[#7b1113] focus:ring-[#7b1113] bg-white"
                          value={newRating.department}
                          onChange={(e) => setNewRating({...newRating, department: e.target.value})}
                        >
                          <option value="">Select Department</option>
                          {departments.slice(1).map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Semester</label>
                        <Input
                          placeholder="e.g., 2nd Sem 2023-2024"
                          value={newRating.semester}
                          onChange={(e) => setNewRating({...newRating, semester: e.target.value})}
                          className="border-gray-200 focus:border-[#7b1113] focus:ring-[#7b1113]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Overall Rating *</label>
                        {renderStars(newRating.rating, "lg", true, (rating) => 
                          setNewRating({...newRating, rating})
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Difficulty Level</label>
                        {renderStars(newRating.difficulty, "lg", true, (difficulty) => 
                          setNewRating({...newRating, difficulty})
                        )}
                        <p className="text-xs text-gray-500 mt-2">1 = Very Easy, 5 = Very Hard</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Review *</label>
                      <Textarea
                        placeholder="Share your experience with this class..."
                        value={newRating.review}
                        onChange={(e) => setNewRating({...newRating, review: e.target.value})}
                        className="min-h-[120px] border-gray-200 focus:border-[#7b1113] focus:ring-[#7b1113]"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newRating.isAnonymous}
                          onChange={(e) => setNewRating({...newRating, isAnonymous: e.target.checked})}
                          className="rounded border-gray-300 text-[#7b1113] focus:ring-[#7b1113]"
                        />
                        <span className="text-sm text-gray-700">Post anonymously</span>
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={handleSubmitRating} className="bg-[#7b1113] hover:bg-[#6a0e10] text-white">
                        Submit Rating
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-gray-200 hover:bg-gray-50">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ratings List */}
            <div className="space-y-4">
              {filteredRatings.length === 0 ? (
                <Card className="border border-gray-100">
                  <CardContent className="text-center py-16">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 text-lg">No ratings found. Be the first to review this class!</p>
                  </CardContent>
                </Card>
              ) : (
                filteredRatings.map((rating) => (
                  <Card key={rating.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-2xl font-bold text-[#7b1113]">
                              {rating.courseCode}
                            </h3>
                            {rating.courseName && (
                              <span className="text-gray-600 text-lg">- {rating.courseName}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <User className="w-4 h-4" />
                            <span>Prof. {rating.professor}</span>
                            <span>•</span>
                            <span>{rating.department}</span>
                            {rating.semester && (
                              <>
                                <span>•</span>
                                <span>{rating.semester}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(rating.rating)}
                            <span className="text-sm font-semibold text-[#7b1113]">{rating.rating}/5</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Difficulty:</span>
                            {renderStars(rating.difficulty)}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-800 mb-4 leading-relaxed text-base">
                        {rating.review}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-4">
                          <span>By {rating.reviewer}</span>
                          <span>•</span>
                          <span>{rating.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#7b1113] hover:bg-gray-50">
                            👍 Helpful ({rating.helpful})
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Stats */}
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="border-b border-gray-50">
                <CardTitle className="text-[#7b1113] flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="w-5 h-5" />
                  Popular Courses
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {["Math 21", "CS 11", "Kas 1", "Eng 1", "PE 2"].map((course, index) => (
                    <div key={course} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#7b1113]">{course}</span>
                      <div className="flex items-center gap-1">
                        {renderStars(4 + index * 0.2)}
                        <span className="text-xs text-gray-500 ml-1">({12 + index * 3})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Professors */}
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="border-b border-gray-50">
                <CardTitle className="text-[#7b1113] text-lg font-semibold">
                  Highly Rated Professors
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {[
                    { name: "Dr. Maria Garcia", dept: "Math", rating: 4.9 },
                    { name: "Prof. John Santos", dept: "CS", rating: 4.7 },
                    { name: "Dr. Ana Cruz", dept: "Psych", rating: 4.6 }
                  ].map((prof, index) => (
                    <div key={prof.name} className="text-sm">
                      <div className="font-medium text-[#7b1113]">{prof.name}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-600 text-xs">{prof.dept}</span>
                        <div className="flex items-center gap-1">
                          {renderStars(Math.floor(prof.rating))}
                          <span className="text-xs text-gray-600">{prof.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="border-b border-gray-50">
                <CardTitle className="text-[#7b1113] text-lg font-semibold">
                  Rating Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Be honest and constructive</p>
                  <p>• Include specific examples</p>
                  <p>• Mention teaching style & workload</p>
                  <p>• Help future students decide</p>
                  <p>• Respect professor privacy</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassRatings;
