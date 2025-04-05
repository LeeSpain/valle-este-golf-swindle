
import React from 'react';
import { useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Flag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, isLoading, user } = useAuth();
  const location = useLocation();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Add debug logging for the login component state
  console.log("Login component render:", { 
    isLoading, 
    isLoggedIn: !!user,
    referrer: location.state?.from?.pathname || '/' 
  });

  const onSubmit = async (values: LoginFormValues) => {
    console.log("Form submitted, logging in...");
    await login(values.email, values.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-4">
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <Flag className="h-8 w-8 text-golf-green mr-2" />
            <h1 className="text-2xl font-bold text-golf-green">Karen's Bar Golf Swindle</h1>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access the swindle</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
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
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-gray-500">
            <div>Test accounts:</div>
            <div>admin@example.com / password123</div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
