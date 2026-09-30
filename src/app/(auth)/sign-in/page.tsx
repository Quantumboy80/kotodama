"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleLogoIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Link } from "next-view-transitions";
import { authClient, useSession } from "@/lib/auth/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SignIn() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSigningIn, setIsSigningIn] = useState(false);
  
  // Email/Password states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const error = searchParams?.get("error");
  const showDeviceError = error === "device-verification-failed";

  useEffect(() => {
    if (session?.user) {
      router.push("/profile");
    }
  }, [session, router]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/profile",
      });
      
      if (error) {
        toast.error(error.message || "Sign in configuration error. Check your Google OAuth keys.");
        console.error("Sign in failed:", error);
      }
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });
      if (error) {
        toast.error(error.message || "Invalid credentials");
      } else {
        toast.success("Signed in successfully!");
        router.push("/profile");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setIsEmailLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });
      if (error) {
        toast.error(error.message || "Failed to create account");
      } else {
        toast.success("Account created successfully!");
        router.push("/profile");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsEmailLoading(false);
    }
  };

  if (session?.user) {
    return null; // Prevent flash while redirecting
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="font-excon mb-4 text-4xl font-black text-black sm:text-5xl dark:text-white">
              Welcome!
            </h1>
            <p className="font-satoshi text-lg font-bold text-black/70 dark:text-white/70">
              Sign in & Sign up to access content!
            </p>
          </div>

          {/* Main Sign In Card */}
          <div className="neuro-xl rounded-2xl p-8 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
            <div className="space-y-6">
              
              {/* Device Verification Error */}
              {showDeviceError && (
                <div className="neuro-sm flex items-center gap-3 rounded-lg border-2 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
                  <WarningCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                  <div className="flex-1">
                    <h3 className="font-satoshi text-sm font-bold text-red-800 dark:text-red-200">
                      Device Verification Failed
                    </h3>
                    <p className="font-satoshi text-xs text-red-600 dark:text-red-300">
                      Unable to verify your device for security reasons. Please
                      try again with a different browser or device.
                    </p>
                  </div>
                </div>
              )}

              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 border-2 border-black dark:border-white/20">
                  <TabsTrigger value="signin" className="font-bold data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="font-bold data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-2 border-black dark:border-white/20 focus-visible:ring-black"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-2 border-black dark:border-white/20 focus-visible:ring-black"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isEmailLoading}
                      className="w-full font-bold border-2 border-black dark:border-white bg-black text-white hover:bg-white hover:text-black dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white transition-colors"
                    >
                      {isEmailLoading ? "Signing in..." : "Sign In with Email"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleEmailSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        placeholder="John Doe"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border-2 border-black dark:border-white/20 focus-visible:ring-black"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-2 border-black dark:border-white/20 focus-visible:ring-black"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-2 border-black dark:border-white/20 focus-visible:ring-black"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isEmailLoading}
                      className="w-full font-bold border-2 border-black dark:border-white bg-black text-white hover:bg-white hover:text-black dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white transition-colors"
                    >
                      {isEmailLoading ? "Creating account..." : "Sign Up with Email"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Divider */}
              <div className="relative pt-2">
                <div className="absolute inset-0 flex items-center pt-2">
                  <div className="w-full border-t-2 border-black/20 dark:border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm pt-2">
                  <span className="font-satoshi bg-white px-4 font-bold text-black/60 dark:bg-zinc-900 dark:text-white/60">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Sign In Button */}
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="neuro-button font-satoshi flex w-full items-center justify-center gap-3 py-4 text-lg font-bold transition-all disabled:opacity-50 border-2 border-black dark:border-white/20"
                data-umami-event="sign-in-google"
              >
                <GoogleLogoIcon weight="duotone" className="h-6 w-6" />
                {isSigningIn ? "Redirecting..." : "Google"}
              </Button>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="font-satoshi text-sm font-bold text-black/60 dark:text-white/60">
              By signing in, you agree to our{" "}
              <Link
                href="/terms"
                className="font-black text-black underline decoration-2 underline-offset-2 hover:decoration-4 dark:text-white"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-black text-black underline decoration-2 underline-offset-2 hover:decoration-4 dark:text-white"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
