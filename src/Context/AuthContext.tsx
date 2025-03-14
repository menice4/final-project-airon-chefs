// src/context/AuthContext.tsx
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient"; // Import Supabase client
import { Session, AuthChangeEvent } from "@supabase/supabase-js"; // Import Supabase types

interface AuthContextType {
  session: Session | null;
  googleSignIn: () => Promise<{ error?: string }>;
  githubSignIn: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  // Listen for auth state changes (e.g., after login)
  useEffect(() => {
    // Set initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        if (event === "SIGNED_IN") {
          navigate("/home"); // Redirect to /home after login
        } else if (event === "SIGNED_OUT") {
          navigate("/"); // Redirect to login page after sign-out
        }
      }
    );

    // Cleanup` subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Google Sign-In
  const googleSignIn = async () => {
    const redirectUrl = process.env.NODE_ENV === "production"
      ? "https://quizzmania.vercel.app/home"
      : "http://localhost:5173/home"; // Local dev URL
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectUrl },
      });

    return { error: error?.message };
  };

  // GitHub Sign-In
  const githubSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    return { error: error?.message };
  };

  // Sign-Out
  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ session, googleSignIn, githubSignIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };
