import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
}
const suggestedQuestions = ["What's the latest news in technology?", "Explain quantum computing in simple terms", "How can I improve my productivity?", "What are the best coding practices?", "Tell me about artificial intelligence", "How does blockchain technology work?"];
const SuggestedQuestions = ({
  onQuestionClick
}: SuggestedQuestionsProps) => {
  return <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-[#00b19f]">
          Welcome to Wizdom AI
        </h2>
        <p className="text-muted-foreground text-lg">
          Ask me anything or try one of these suggestions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestedQuestions.map((question, index) => <Button key={index} variant="outline" className="h-auto p-4 text-left justify-start hover:bg-muted/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 group" onClick={() => onQuestionClick(question)}>
            <div className="flex items-start gap-3 w-full">
              <Sparkles className="h-5 w-5 shrink-0 mt-0.5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
              <span className="text-sm leading-relaxed">{question}</span>
            </div>
          </Button>)}
      </div>
    </div>;
};
export default SuggestedQuestions;