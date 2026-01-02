import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = loginSchema.extend({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
});

type UserRole = 'student' | 'teacher';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateForm = () => {
    try {
      if (isLogin) {
        loginSchema.parse({ email, password });
      } else {
        signupSchema.parse({ email, password, fullName });
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Login failed',
            description: error.message === 'Invalid login credentials' 
              ? 'Invalid email or password. Please try again.' 
              : error.message,
            variant: 'destructive',
          });
        }
      } else {
        const { error } = await signUp(email, password, fullName, role);
        if (error) {
          const message = error.message.includes('already registered')
            ? 'This email is already registered. Please login instead.'
            : error.message;
          toast({
            title: 'Signup failed',
            description: message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Account created!',
            description: 'Welcome to SmartCampus!',
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-campus-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-campus-light/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-campus-navy/50 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-campus-teal to-campus-light mb-4 shadow-2xl shadow-campus-teal/30">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">SmartCampus</h1>
          <p className="text-gray-400 mt-2 text-lg">Your intelligent campus assistant</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
          {/* Role Selection */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 py-4 px-4 rounded-xl font-semibold transition-all duration-300 ${
                role === 'student'
                  ? 'bg-gradient-to-r from-campus-teal to-campus-light text-white shadow-lg shadow-campus-teal/30 scale-[1.02]'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 border border-gray-700/50'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`flex-1 py-4 px-4 rounded-xl font-semibold transition-all duration-300 ${
                role === 'teacher'
                  ? 'bg-gradient-to-r from-campus-teal to-campus-light text-white shadow-lg shadow-campus-teal/30 scale-[1.02]'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 border border-gray-700/50'
              }`}
            >
              Teacher
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-gray-800/30 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isLogin
                  ? 'bg-gray-700/80 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                !isLogin
                  ? 'bg-gray-700/80 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-300 font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-12 h-12 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-campus-teal focus:ring-campus-teal/20 rounded-xl"
                  />
                </div>
                {errors.fullName && <p className="text-red-400 text-sm">{errors.fullName}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-12 h-12 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-campus-teal focus:ring-campus-teal/20 rounded-xl"
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-12 h-12 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-campus-teal focus:ring-campus-teal/20 rounded-xl"
                />
              </div>
              {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-campus-teal to-campus-light hover:opacity-90 text-white font-semibold text-lg rounded-xl shadow-lg shadow-campus-teal/30 transition-all duration-300 hover:shadow-xl hover:shadow-campus-teal/40 hover:scale-[1.02]"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : isLogin ? (
                'Login'
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Secure login powered by SmartCampus
        </p>
      </div>
    </div>
  );
};

export default Auth;
