const TypingIndicator = () => {
  return (
    <div className="flex justify-start w-full animate-fade-in">
      <div className="bg-ai-message text-ai-message-foreground border border-border rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
