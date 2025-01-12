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
      <div className="w-1/2 bg-gray-200 flex items-center justify-center relative overflow-hidden">
  {/* Animated Container for the Left Section */}
  <motion.div
    className="text-3xl font-bold text-gray-700 z-10"
    initial={{ opacity: 0, scale: 0.8 }} // Initial scale and opacity
    animate={{ opacity: 1, scale: 1 }} // Final scale and opacity
    transition={{
      duration: 1, // Duration of the animation
      ease: 'easeOut', // Easing for smooth transition
    }}
  >
    Welcome Back! Let&apos;s get back on!
  </motion.div>

  {/* Floating Abstract Shape */}
  <motion.div
    className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-500 rounded-full opacity-60 filter blur-3xl"
    initial={{ x: '-50%', y: '-50%' }}
    animate={{
      x: ['-50%', '50%', '-50%'], // Animate X axis from left to right
      y: ['-50%', '50%', '-50%'], // Animate Y axis up and down
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    }}
  />

  {/* Second Animated Shape (Indigo Circle) */}
  <motion.div
    className="absolute top-1/2 left-1/4 w-32 h-32 bg-pink-800 rounded-full opacity-60 filter blur-3xl"
    initial={{ x: '100%', y: '100%' }}
    animate={{
      x: ['-90%', '-60%', '-120%'], // Animate X axis from left to right
      y: ['100%', '-50%', '-50%'], // Animate Y axis up and down
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    }}
  />

  {/* Third Animated Shape (Yellow Circle) */}
  <motion.div
    className="absolute top-1/4 left-1/3 w-24 h-24 bg-indigo-900 rounded-full opacity-50 filter blur-2xl"
    initial={{ x: '-100%', y: '-100%' }}
    animate={{
      x: ['0%', '60%', '100%'], // Move horizontally
      y: ['0%', '80%', '0%'],   // Move vertically in an arc
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    }}
  />

  {/* Fourth Animated Shape (Green Circle) */}
  <motion.div
    className="absolute top-1/3 left-1/2 w-40 h-40 bg-purple-400 rounded-full opacity-70 filter blur-3xl"
    initial={{ x: '50%', y: '-50%' }}
    animate={{
      x: ['50%', '-100%', '150%'], // Move X axis with a bounce effect
      y: ['-50%', '30%', '-50%'],  // Move Y axis in a circular pattern
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    }}
  />

  {/* Fifth Animated Shape (Orange Circle) */}
  <motion.div
    className="absolute top-1/2 right-1/4 w-28 h-28 bg-pink-500 rounded-full opacity-40 filter blur-xl"
    initial={{ x: '100%', y: '50%' }}
    animate={{
      x: ['100%', '-50%', '100%'], // Move X axis horizontally
      y: ['50%', '150%', '50%'],   // Move Y axis in an up-and-down motion
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    }}
  />
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
