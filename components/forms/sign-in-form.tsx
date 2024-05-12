"use client";
import { Button } from "@/components/ui/button";
import clientConnectionWithSupabase from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
// import GoogleSignInButton from "../github-auth-button";
const supabase = clientConnectionWithSupabase()
const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string()
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get("callbackUrl");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const defaultValues = {
    email: "demo@gmail.com",
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSignIn = async (data: UserFormValue) => {
    setLoading(true);
    // Sign in the user with Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email : data.email, password:data.password
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
                className: "bg-green-400",
                description: "Logged in successfully",
            });
            router.push("/dashboard");
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

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignIn)}
          className="space-y-2 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Don't have an account? Sign up!
          </span>
        </div>
      </div>
      <Button disabled={loading} onClick={()=> {
        router.push("/sign-up")
      }} className="ml-auto w-full" type="button">
            Sign-Up
      </Button>
    </>
  );
}