import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import VideoChat from "./components/VideoChat";
import Dating from "./components/Dating";
import FreedomWall from "./components/FreedomWall";
import ClassRatings from "./components/ClassRatings";
import Profile from "./components/Profile";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/video-chat" element={
            <div>
              <Navigation />
              <VideoChat />
            </div>
          } />
          <Route path="/dating" element={
            <div>
              <Navigation />
              <Dating />
            </div>
          } />
          <Route path="/freedom-wall" element={
            <div>
              <Navigation />
              <FreedomWall />
            </div>
          } />
          <Route path="/class-ratings" element={
            <div>
              <Navigation />
              <ClassRatings />
            </div>
          } />
          <Route path="/profile" element={
            <div>
              <Navigation />
              <Profile />
            </div>
          } />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
