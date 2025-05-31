import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.endsWith("@up.edu.ph")) {
      setError("Only @up.edu.ph emails are allowed.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-[#7b1113]">Login</h2>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <input
          type="email"
          placeholder="UP Email (@up.edu.ph)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7b1113]"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7b1113]"
          required
        />
        <button
          type="submit"
          className="w-full bg-[#7b1113] text-white py-3 rounded-lg font-semibold hover:bg-[#8b1315] transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-center text-sm">
          Don&apos;t have an account? <Link to="/auth/signup" className="text-[#7b1113] underline">Sign up</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage; 