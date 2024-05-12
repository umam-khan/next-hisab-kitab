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
// import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
// import GoogleSignInButton from "../github-auth-button";
const supabase = clientConnectionWithSupabase()
const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(8, { message: "Password is too short" })
  .max(20, { message: "Password is too long" }),
  username: z.string(),
  language: z.string(),
  contact: z.number({
    required_error: "required field",
    invalid_type_error: "phone number is required",
  })
  .min(10)
  .max(10),
  city: z.string()
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  // const searchParams = useSearchParams();
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

  const handleSignUp = async (data: UserFormValue) => {
    setLoading(true);

    // First, sign up the user with Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email:data.email, password:data.password
    });

    if (authData.user) {
        // If the user is successfully created, insert additional details into the users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert([
                { 
                    user_id: authData.user.id,  // Correctly set as the foreign key
                    username: data.username,
                    email: data.email,
                    language: data.language,
                    contact: data.contact,
                    city: data.city
                }
            ]);

        if (userData) {
            // Prepare user object to store in local storage
            const userObject = {
                user_id: authData.user.id,
                username: data.username,
                email: data.email,
                language: data.language,
                contact: data.contact,
                city: data.city
            };

            // Store user details in local storage
            localStorage.setItem('user', JSON.stringify(userObject));

            toast({
                variant: "default",
                title: "Successful",
                className: "bg-green-400",
                description: "Account created successfully",
            });
            router.push("/dashboard");
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
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignUp)}
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
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="username"
                    placeholder="Enter your username..."
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
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your language..."
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
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter your contact..."
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
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your city..."
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
            Or if you have an account, then sign-in
          </span>
        </div>
      </div>
      <Button disabled={loading} onClick={()=> {
        router.push("/sign-in")
      }} className="ml-auto w-full" type="button">
            Sign-In
      </Button>
    </>
  );
}