import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../lib/api";
// import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  // ADD THIS LINE BACK IN! This is the key to the React Guard.
  const { login } = useAuth(); 
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  // const { login } = useAuth();
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  // const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  // Get admins array from localStorage
  const admins= JSON.parse(
    localStorage.getItem("admins") || "[]"
  );

const matchedAdmin = admins.find(
  (admin) =>
    (admin.username === username)
);
    if (matchedAdmin || (username === "admin" && password === "admin123")){
      
      // 1. Put the Basic Auth code in the pocket for the Spring Boot server
      const encodedCredentials = btoa(`${username}:${password}`);
      localStorage.setItem("basicAuth", encodedCredentials);

      // 2. TELL THE REACT GUARD WE ARE OFFICIALLY LOGGED IN!
      login(username, password);

      // 3. Now it will successfully let us drive to the dashboard
      navigate("/");

    } else {
      setError("Invalid username or password!");
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Finova Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
