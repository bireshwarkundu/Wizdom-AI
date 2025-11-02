import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Free",
    price: 0,
    currency: "INR",
    billing_cycle: "monthly",
    features: [
      "50 messages per month",
      "Basic AI model access",
      "Short-term memory",
      "No file or link integration",
      "Standard encryption",
      "Community support only",
      "English language only"
    ]
  },
  {
    name: "Pro",
    price: 499,
    currency: "INR",
    billing_cycle: "monthly",
    popular: true,
    features: [
      "Unlimited messages",
      "Advanced AI (GPT-4 class)",
      "Long conversation memory",
      "File, link, and document integration",
      "Basic analytics dashboard",
      "Custom personality setup",
      "Priority support",
      "10+ language support",
      "Slack and Discord integration"
    ]
  },
  {
    name: "Business",
    price: 1499,
    currency: "INR",
    billing_cycle: "monthly",
    features: [
      "Unlimited messages",
      "Custom fine-tuned AI model",
      "Persistent user memory",
      "Multi-source integration (Google Drive, Notion, APIs)",
      "Full analytics + conversation insights",
      "White-label branding",
      "Enterprise-grade security compliance",
      "Full API + webhook automation",
      "Unlimited team members",
      "24×7 dedicated support",
      "100+ language support",
      "CRM, ERP, and Zapier integrations"
    ]
  }
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 sticky top-0 z-50 bg-background">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-[#013e37]">Wizdom AI</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm hover:text-primary transition-colors">Home</Link>
            <Link to="/pricing" className="text-sm hover:text-primary transition-colors">Pricing</Link>
            <Link to="/auth">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>
      
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-muted-foreground text-lg">
              Select the perfect plan for your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.name}
                className={plan.popular ? "border-2 border-[#14b8a6] shadow-2xl scale-105 relative overflow-hidden bg-slate-950 dark:bg-slate-950" : ""}
              >
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-[#14b8a6]/10 pointer-events-none" />
                )}
                <CardHeader>
                  {plan.popular && (
                    <div className="relative mb-2">
                      <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-black to-[#14b8a6] text-white text-xs font-bold tracking-wider shadow-lg">
                        ✨ MOST POPULAR
                      </div>
                    </div>
                  )}
                  <CardTitle className={plan.popular ? "text-2xl text-[#FFFFFF]" : "text-2xl"}>{plan.name}</CardTitle>
                  <CardDescription className={plan.popular ? "text-[#FFFFFF]" : ""}>
                    <div className="mt-4">
                      <span className={`text-4xl font-bold ${plan.popular ? "text-[#FFFFFF]" : "text-foreground"}`}>
                        ₹{plan.price}
                      </span>
                      <span className={plan.popular ? "text-[#FFFFFF]" : "text-muted-foreground"}>/{plan.billing_cycle}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className={`h-5 w-5 shrink-0 mt-0.5 ${plan.popular ? "text-[#14b8a6]" : "text-primary"}`} />
                        <span className={`text-sm ${plan.popular ? "text-[#FFFFFF]" : ""}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.price === 0 ? "Get Started" : "Subscribe"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
