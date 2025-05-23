import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { X } from "lucide-react";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  passwordConfirmation: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterModal({ open, onClose, onOpenLogin }: RegisterModalProps) {
  const { register, loginWithGoogle, isLoading } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await register(data.username, data.email, data.password);
      onClose();
      form.reset();
    } catch (error) {
      // Error is handled in the useAuth hook
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (error) {
      // Error is handled in the useAuth hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create your account</DialogTitle>
          <DialogDescription>
            Sign up to save and access your vehicle reports from any device.
          </DialogDescription>
        </DialogHeader>

        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            onClick={onClose}
            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lemon-500"
          >
            <span className="sr-only">Close</span>
            <X className="h-6 w-6" />
          </button>
        </div>

        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full justify-center border-gray-300 mt-2"
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 0C4.477 0 0 4.477 0 10C0 15.523 4.477 20 10 20C15.523 20 20 15.523 20 10C20 4.477 15.523 0 10 0ZM14.7 12.8C14.4 13.3 14 13.7 13.5 14C13 14.3 12.5 14.5 11.9 14.6C11.3 14.7 10.7 14.7 10 14.7C8.6 14.7 7.3 14.3 6.2 13.4C5.1 12.5 4.4 11.4 4.1 10C3.8 8.6 4 7.3 4.7 6.1C5.4 4.9 6.4 4 7.8 3.4C9.2 2.8 10.7 2.7 12.3 3.1C13.9 3.5 15.1 4.4 16 5.7L14 7.4C13.5 6.6 12.8 6 11.9 5.7C11 5.4 10.1 5.5 9.3 5.9C8.5 6.3 7.9 6.9 7.5 7.7C7.1 8.5 7 9.3 7.2 10.2C7.4 11.1 7.9 11.8 8.6 12.3C9.3 12.8 10.1 13 11 13C11.6 13 12.1 12.9 12.6 12.6C13.1 12.3 13.5 12 13.7 11.5C13.9 11 14 10.5 14 10H10V8H16C16.2 8.9 16.1 9.8 15.8 10.7C15.5 11.5 15.1 12.2 14.7 12.8Z" />
          </svg>
          Continue with Google
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      autoComplete="name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      type="email"
                      autoComplete="email"
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
                      placeholder="Choose a password"
                      {...field}
                      type="password"
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm your password"
                      {...field}
                      type="password"
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-2 text-gray-900 bg-lemon-500 hover:bg-lemon-600"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center">
          <button
            onClick={onOpenLogin}
            className="text-sm text-lemon-600 hover:text-lemon-500"
          >
            Already have an account? Sign in
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
