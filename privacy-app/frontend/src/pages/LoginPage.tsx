import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import {motion} from 'framer-motion'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {

  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const blobRef = useRef<HTMLDivElement | null>(null);
  const [isOnLeftSide, setIsOnLeftSide] = useState(false); // Track whether we're on the left side

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid credentials. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Left Side */}
      <div className="w-1/2 bg-gray-200 flex items-center justify-center relative">
        <motion.div className="text-3xl font-bold text-gray-700 z-10">Welcome Back</motion.div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-white px-8 py-6 relative z-10">
        <h2 className="text-3xl font-bold text-black-600 mb-2">Sign in</h2>
        <p className="text-sm text-gray-500 mb-6">Enter your email and password to continue</p>
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

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>

          {/* Redirect to Signup */}
          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>

      {/* Blue Blob (visible only on the left side) */}
      <div
        ref={blobRef}
        className="blob absolute -z-1 w-24 h-24 bg-blue-500 rounded-full opacity-50 pointer-events-none"
        style={{
          filter: 'url(#goo) blur(32px)', // Apply the blur filter
        }}
      />

      {/* SVG Filter for Blob */}
      <svg xmlns="http://www.w3.org/2000/svg" className="hidden">
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
