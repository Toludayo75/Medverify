import { useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldCheck, Lock } from "lucide-react";

// Login form schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const { user, loginMutation } = useAuth();
  const [, navigate] = useLocation();

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate("/admin");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle login submission
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  if (user && user.role === 'admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Admin login form */}
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-display font-bold text-center">
                NAFDAC DrugVerify Admin
              </CardTitle>
              <CardDescription className="text-center">
                Sign in with your administrator credentials to access the control panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center">
                      <Lock className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="admin@nafdac.gov.ng" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-dark"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Hero content */}
          <div className="hidden lg:block">
            <div className="text-center lg:text-left lg:pl-4">
              <h2 className="text-3xl font-bold font-display text-neutral-900">
                NAFDAC DrugVerify Admin Portal
              </h2>
              <p className="mt-4 text-lg text-neutral-600">
                Administrator access is restricted to authorized NAFDAC personnel only. As an administrator, you can:
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mr-3" />
                  <span className="text-neutral-700">Manage the database of registered pharmaceutical products</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mr-3" />
                  <span className="text-neutral-700">Review and process suspicious drug reports</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mr-3" />
                  <span className="text-neutral-700">Update drug statuses and blacklist counterfeit medications</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mr-3" />
                  <span className="text-neutral-700">Access comprehensive verification logs and usage statistics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}