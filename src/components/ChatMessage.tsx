import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Copy, Check } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handlePreview = (code: string) => {
    // Open code in a new window for preview
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(code);
      previewWindow.document.close();
    }
  };

  return (
    <div
      className={cn(
        "flex w-full animate-slide-up",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-5 py-3 shadow-lg transition-all hover:shadow-xl",
          isUser
            ? "bg-user-message text-user-message-foreground"
            : "bg-ai-message text-ai-message-foreground border border-border"
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message}
          </p>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              components={{
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");
                  const language = match ? match[1] : "";
                  const isCodeBlock = match && className?.includes("language-");

                  return isCodeBlock ? (
                    <div className="relative group my-2">
                      <div className="flex items-center justify-between bg-muted px-3 py-2 rounded-t-lg">
                        <span className="text-xs text-muted-foreground font-mono">
                          {language}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopyCode(codeString)}
                          >
                            {copiedCode === codeString ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                          {(language === "html" || language === "jsx" || language === "tsx") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handlePreview(codeString)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <SyntaxHighlighter
                        style={oneDark as any}
                        language={language}
                        PreTag="div"
                        customStyle={{
                          margin: 0,
                          borderTopLeftRadius: 0,
                          borderTopRightRadius: 0,
                          borderBottomLeftRadius: "0.5rem",
                          borderBottomRightRadius: "0.5rem",
                        } as any}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code
                      className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message}
            </ReactMarkdown>
          </div>
        )}
        {timestamp && (
          <span className="text-xs opacity-60 mt-2 block">
            {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
