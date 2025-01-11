import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Link } from 'react-router-dom';

// Schema definition for signup form validation
const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const blobRef = useRef<HTMLDivElement | null>(null);
  const [isOnLeftSide, setIsOnLeftSide] = useState(false); // Track whether we're on the left side

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // Track the mouse movement to move the blob
  useEffect(() => {
    console.log(isOnLeftSide)
    const moveBlob = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Check if the mouse is on the left side of the screen
      setIsOnLeftSide(mouseX < window.innerWidth / 2);

      if (blobRef.current && isOnLeftSide) {
        // Update blob position
        blobRef.current.style.left = `${mouseX - 48}px`;
        blobRef.current.style.top = `${mouseY - 48}px`;
      }
    };

    // Add mousemove event listener
    document.addEventListener('mousemove', moveBlob);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousemove', moveBlob);
    };
  }, [isOnLeftSide]); // Ensure this effect depends on `isOnLeftSide`

  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      toast({
        title: 'Success',
        description: 'Account created successfully! Please log in.',
        duration: 5000,
      });

      navigate('/login');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create account',
      });
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Left Side */}
      <div className="w-1/2 bg-gray-200 flex items-center justify-center relative">
        <h1 className="text-3xl font-bold text-gray-700 z-10">Welcome to Our Platform</h1>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-white px-8 py-6 relative z-10">
        <h2 className="text-3xl font-bold text-black-600 mb-2">Create an Account</h2>
        <p className="text-sm text-gray-500 mb-6">Enter your email and password below to continue</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm">
          {/* Email Input */}
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Confirm Password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Password Guidelines */}
          <div className="text-sm text-gray-500">
            Password must contain:
            <ul className="list-disc list-inside mt-1">
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
              <li>One special character</li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up Now'}
          </Button>

          {/* Redirect to Login */}
          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>

      </div>

      {isOnLeftSide && (
        <div
          ref={blobRef}
          className="blob absolute -z-1 w-24 h-24 bg-blue-500 rounded-full opacity-50 pointer-events-none"
          style={{
            filter: 'url(#goo) blur(32px)', // Apply the blur filter
          }}
        />
      )}

      {/* SVG Filter for Blur */}
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
