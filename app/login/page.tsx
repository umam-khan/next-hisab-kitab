'use client'
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import clientConnectionWithSupabase from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
const supabase = clientConnectionWithSupabase()
export default function Page() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [language, setLanguage] = useState("");
    const [contact, setContact] = useState("");
    const [city, setCity] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    // client side auth
    const handleSignIn = async () => {
        setLoading(true);
    
        // Sign in the user with Supabase auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email, password
        });
    
        if (authData.user) {
            // If the user is successfully authenticated, fetch additional user details
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('user_id', authData.user.id)
                .single();
    
            if (userData) {
                // Prepare user object to store in local storage
                const userObject = {
                    user_id: authData.user.id,
                    username: userData.username,
                    email: userData.email,
                    language: userData.language,
                    contact: userData.contact,
                    city: userData.city
                };
    
                // Store user details in local storage
                localStorage.setItem('user', JSON.stringify(userObject));
    
                toast({
                    variant: "default",
                    title: "Successful",
                    description: "Logged in successfully",
                });
                router.push("/");
            } else {
                // Handle case where user authentication passes but fetching user details fails
                toast({
                    variant: "destructive",
                    title: "Login Warning",
                    description: "Logged in but failed to load user details: " + (userError?.message || "Unknown error"),
                });
            }
        } else {
            toast({
                variant: "destructive",
                title: "Failed",
                description: "Email or password doesn't exist: " + (authError?.message || "Unknown error"),
            });
        }
    
        setLoading(false);
    };
    
    const handleSignUp = async () => {
        setLoading(true);
    
        // First, sign up the user with Supabase auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email, password
        });
    
        if (authData.user) {
            // If the user is successfully created, insert additional details into the users table
            const { data: userData, error: userError } = await supabase
                .from('users')
                .insert([
                    { 
                        user_id: authData.user.id,  // Correctly set as the foreign key
                        username: username,
                        email: email,
                        language: language,
                        contact: contact,
                        city: city
                    }
                ]);
    
            if (userData) {
                // Prepare user object to store in local storage
                const userObject = {
                    user_id: authData.user.id,
                    username: username,
                    email: email,
                    language: language,
                    contact: contact,
                    city: city
                };
    
                // Store user details in local storage
                localStorage.setItem('user', JSON.stringify(userObject));
    
                toast({
                    variant: "default",
                    title: "Successful",
                    description: "Account created successfully",
                });
                router.push("/");
            } else if (userError) {
                toast({
                    variant: "destructive",
                    title: "Failed",
                    description: "An error occurred while saving user details: " + userError.message,
                });
            }
        } else if (authError) {
            toast({
                variant: "destructive",
                title: "Failed",
                description: "An error occurred during sign up: " + authError.message,
            });
        }
    
        setLoading(false);
    };
    
  return (
    <div className="w-full h-screen flex-col flex justify-center items-center">
      <h1 className="text-4xl text-black tracking-tighter font-bold">
        Login to your account
      </h1>
      <div className="w-3/12">
        <div className="my-4">
          <label htmlFor="email" className="py-1">
            Email Address
          </label>
          <input
          value={email}
          onChange={(e)=>{
            setEmail(e.target.value)
          }}
            type="email"
            name="email"
            id="email"
            className="text-black px-3 w-full h-12 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>
        <div className="my-4">
          <label htmlFor="password" className="py-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
          onChange={(e)=>{
            setPassword(e.target.value)
          }}
            id="password"
            className="text-black px-3 w-full h-12 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>
        <div className="my-4">
          <label htmlFor="language" className="py-1">
            language
          </label>
          <input
            type="language"
            name="language"
            value={language}
          onChange={(e)=>{
            setLanguage(e.target.value)
          }}
            id="language"
            className="text-black px-3 w-full h-12 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>
        <div className="my-4">
          <label htmlFor="city" className="py-1">
            city
          </label>
          <input
            type="city"
            name="city"
            value={city}
          onChange={(e)=>{
            setCity(e.target.value)
          }}
            id="city"
            className="text-black px-3 w-full h-12 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>
        <div className="my-4">
          <label htmlFor="contact" className="py-1">
            contact
          </label>
          <input
            type="contact"
            name="contact"
            value={contact}
          onChange={(e)=>{
            setContact(e.target.value)
          }}
            id="contact"
            className="text-black px-3 w-full h-12 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>
        <div className="my-4">
          <label htmlFor="username" className="py-1">
            username
          </label>
          <input
            type="username"
            name="username"
            value={username}
          onChange={(e)=>{
            setUsername(e.target.value)
          }}
            id="username"
            className="text-black px-3 w-full h-12 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>
        <button onClick={handleSignIn} className="border-none h-12 mb-3 rounded-md justify-center flex items-center text-white bg-indigo-600 hover:bg-indigo-500 transition duration-200 shadow-lg shadow-indigo-600/35 w-full">
          Sign in
          {loading && <Loader2 className="w-5 h-5 ml-3 animate-spin" />}
        </button>
        <button onClick={handleSignUp} className="border-none h-12 rounded-md justify-center flex items-center text-white bg-purple-600 hover:bg-purple-500 transition duration-200 shadow-lg shadow-purple-600/35 w-full">
          Sign up
          {loading && <Loader2 className="w-5 h-5 ml-3 animate-spin" />}
        </button>
      </div>
    </div>
  );
}