import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Play, MessageSquare, Brain, Database, BarChart3, Sparkles, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { motion } from "framer-motion";
import { GlowingEffect } from "@/components/ui/glowing-effect";
const features = [{
  title: "Natural Conversations",
  description: "Engages in realistic, context-aware conversations that feel truly human.",
  icon: MessageSquare
}, {
  title: "Smart Memory",
  description: "Remembers user preferences, past chats, and adapts automatically.",
  icon: Brain
}, {
  title: "Knowledge Integration",
  description: "Connects with files, websites, and databases to give precise answers.",
  icon: Database
}, {
  title: "Analytics Dashboard",
  description: "Gain insights into your chat usage, topics, and performance trends.",
  icon: BarChart3
}, {
  title: "Custom Personality",
  description: "Set your chatbot's tone, behavior, and purpose for business or personal use.",
  icon: Sparkles
}, {
  title: "24/7 Availability",
  description: "Always ready to assist you, anytime and anywhere, with instant responses.",
  icon: Clock
}];
const testimonials = [{
  name: "Riya Sharma",
  role: "Startup Founder",
  feedback: "Wizdom AI has become my daily productivity partner. I can't imagine running my business without it."
}, {
  name: "Amit Patel",
  role: "Freelance Developer",
  feedback: "I love how Wizdom AI remembers my past tasks and helps me manage code snippets effortlessly."
}, {
  name: "Sneha Roy",
  role: "Marketing Manager",
  feedback: "The Pro plan is a game-changer — I use it to automate reports and client replies."
}];
const Landing = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 sticky top-0 z-50 bg-background">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-[#013e37]">Wizdom AI</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="text-sm hover:text-primary transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm hover:text-primary transition-colors">Testimonials</a>
            {user ? (
              <Link to="/chat">
                <Button size="sm">Go to Chat</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="space-y-6 animate-fade-in">
            <motion.div className="relative flex flex-col items-center justify-center gap-4 sm:flex-row">
              <LayoutTextFlip
                text="Wizdom AI can "
                words={["Think", "Chat", "Learn", "Assist", "Automate"]}
                duration={2500}
              />
            </motion.div>
            <p className="text-xl text-muted-foreground mt-6">
              Chat, manage, and automate tasks just like a real human assistant.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              {user ? (
                <Link to="/pricing">
                  <Button size="lg" className="text-lg px-8">
                    View Pricing
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="text-lg px-8">
                    Get Started
                  </Button>
                </Link>
              )}
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-4xl font-bold">Smart Features that Make Conversations Human-like</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience AI that understands context, remembers your preferences, and delivers precise results
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="relative p-[2px] rounded-2xl animate-fade-in" style={{
                animationDelay: `${index * 100}ms`
              }}>
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <Card className="relative h-full hover:shadow-lg transition-all hover:scale-105 overflow-hidden bg-card">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            );
          })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-4xl font-bold">Choose Your Plan</h3>
            <p className="text-muted-foreground text-lg">
              Simple pricing for every need — from individuals to enterprises
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">₹0</span>
                    <span className="text-muted-foreground">/monthly</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">50 messages per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">Basic AI model access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">Short-term memory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">No file or link integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">Standard encryption</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">Community support only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">English language only</span>
                  </li>
                </ul>
                <Link to="/auth">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-[#14b8a6] shadow-2xl scale-105 relative overflow-hidden bg-slate-950">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-[#14b8a6]/10 pointer-events-none" />
              <CardHeader>
                <div className="relative mb-2">
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-black to-[#14b8a6] text-white text-xs font-bold tracking-wider shadow-lg">
                    ✨ MOST POPULAR
                  </div>
                </div>
                <CardTitle className="text-2xl text-white">Pro</CardTitle>
                <CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">₹499</span>
                    <span className="text-white">/monthly</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-[#14b8a6]" />
                    <span className="text-sm text-white">Unlimited messages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-[#14b8a6]" />
                    <span className="text-sm text-white">Advanced AI (GPT-4 class)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-[#14b8a6]" />
                    <span className="text-sm text-white">Long conversation memory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-[#14b8a6]" />
                    <span className="text-sm text-white">File, link, and document integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-[#14b8a6]" />
                    <span className="text-sm text-white">Basic analytics dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-[#14b8a6]" />
                    <span className="text-sm text-white">Custom personality setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-[#14b8a6]" />
                    <span className="text-sm text-white">Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-[#14b8a6]" />
                    <span className="text-sm text-white">10+ language support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-[#14b8a6]" />
                    <span className="text-sm text-white">Slack and Discord integration</span>
                  </li>
                </ul>
                <Link to="/auth">
                  <Button className="w-full">Subscribe</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Business Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Business</CardTitle>
                <CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">₹1,499</span>
                    <span className="text-muted-foreground">/monthly</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">Unlimited messages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">Custom fine-tuned AI model</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">Persistent user memory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">Multi-source integration (Google Drive, Notion, APIs)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">Full analytics + conversation insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">White-label branding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">Enterprise-grade security compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">Full API + webhook automation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">Unlimited team members</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">24×7 dedicated support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">100+ language support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm">CRM, ERP, and Zapier integrations</span>
                  </li>
                </ul>
                <Link to="/auth">
                  <Button variant="outline" className="w-full">Subscribe</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-6 py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold">What Our Users Say</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <Card key={index} className="animate-fade-in" style={{
            animationDelay: `${index * 150}ms`
          }}>
                <CardHeader>
                  <CardDescription className="text-base italic">
                    "{testimonial.feedback}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h4 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Wizdom AI
              </h4>
              <p className="text-sm text-muted-foreground">
                Your intelligent AI assistant for everyday productivity.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Connect</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="https://twitter.com/wizdomai" className="hover:text-primary transition-colors">Twitter</a></li>
                <li><a href="https://linkedin.com/company/wizdomai" className="hover:text-primary transition-colors">LinkedIn</a></li>
                <li><a href="https://instagram.com/wizdomai" className="hover:text-primary transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2025 Wizdom AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Landing;