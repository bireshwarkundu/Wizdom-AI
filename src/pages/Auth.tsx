import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import { differenceInYears } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [birthMonth, setBirthMonth] = useState<number | null>(null);
  const [birthDay, setBirthDay] = useState<number | null>(null);
  const [dateStep, setDateStep] = useState<'year' | 'month' | 'day' | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 18 - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/chat");
      }
    });
  }, [navigate]);

  const calculateAge = (date: Date) => {
    return differenceInYears(new Date(), date);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (birthYear === null || birthMonth === null || birthDay === null) {
      toast({
        title: "Birth date required",
        description: "Please select your complete birth date",
        variant: "destructive",
      });
      return;
    }

    const birthDate = new Date(birthYear, birthMonth, birthDay);
    const age = calculateAge(birthDate);
    if (age < 18) {
      toast({
        title: "Age restriction",
        description: "You must be 18 or older to use Wizdom AI",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const birthDateString = `${birthYear}-${String(birthMonth + 1).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            birth_date: birthDateString,
          },
        },
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created!",
          description: "Welcome to Wizdom AI",
        });
        navigate("/chat");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in",
        });
        navigate("/chat");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold" style={{ color: '#14b8a6' }}>
              Wizdom AI
            </h1>
          </Link>
          <p className="text-muted-foreground mt-2">
            {isLogin ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 border">
          <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label>Birth Date</Label>
                {dateStep === null ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => setDateStep('year')}
                  >
                    {birthYear && birthMonth !== null && birthDay ? (
                      <span>{`${months[birthMonth]} ${birthDay}, ${birthYear}`}</span>
                    ) : (
                      <span className="text-muted-foreground">Select your birth date</span>
                    )}
                  </Button>
                ) : dateStep === 'year' ? (
                  <div className="border rounded-md p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-base font-semibold">Select Year</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDateStep(null)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </div>
                    <ScrollArea className="h-[200px]">
                      <div className="grid grid-cols-3 gap-2">
                        {years.map((year) => (
                          <Button
                            key={year}
                            type="button"
                            variant={birthYear === year ? "default" : "outline"}
                            className="w-full"
                            onClick={() => {
                              setBirthYear(year);
                              setDateStep('month');
                            }}
                          >
                            {year}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : dateStep === 'month' ? (
                  <div className="border rounded-md p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-base font-semibold">Select Month</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDateStep('year')}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {months.map((month, index) => (
                        <Button
                          key={month}
                          type="button"
                          variant={birthMonth === index ? "default" : "outline"}
                          className="w-full"
                          onClick={() => {
                            setBirthMonth(index);
                            setDateStep('day');
                          }}
                        >
                          {month.slice(0, 3)}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-md p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-base font-semibold">Select Day</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDateStep('month')}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </div>
                    <ScrollArea className="h-[200px]">
                      <div className="grid grid-cols-7 gap-2">
                        {birthYear && birthMonth !== null && Array.from(
                          { length: getDaysInMonth(birthYear, birthMonth) },
                          (_, i) => i + 1
                        ).map((day) => (
                          <Button
                            key={day}
                            type="button"
                            variant={birthDay === day ? "default" : "outline"}
                            className="w-full"
                            onClick={() => {
                              setBirthDay(day);
                              setDateStep(null);
                            }}
                          >
                            {day}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  You must be 18 or older to use Wizdom AI
                </p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;