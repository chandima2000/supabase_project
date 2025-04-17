import { useState, ChangeEvent } from "react";
import { supabase } from "../supabase-client";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        console.error("Error signing up:", signUpError.message);
        return;
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Error signing in:", signInError.message);
        return;
      }
    }
  };

  
  return (
    <div className="max-w-sm mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {isSignUp ? "Sign Up" : "Sign In"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="mt-4 w-full text-blue-600 hover:underline"
      >
        {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
      </button>
    </div>
  );
}
