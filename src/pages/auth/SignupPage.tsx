import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.endsWith("@up.edu.ph")) {
      setError("Only @up.edu.ph emails are allowed.");
      return;
    }
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    // Create profile row
    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email: data.user.email,
        name,
      });
    }
    setLoading(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-[#7b1113]">Sign Up</h2>
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
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7b1113]"
          required
        />
        <button
          type="submit"
          className="w-full bg-[#7b1113] text-white py-3 rounded-lg font-semibold hover:bg-[#8b1315] transition"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <div className="text-center text-sm">
          Already have an account? <Link to="/auth/login" className="text-[#7b1113] underline">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default SignupPage; 