import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Menu, ArrowUp, LogOut } from "lucide-react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import SuggestedQuestions from "./SuggestedQuestions";
import ChatSidebar from "./ChatSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}
interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
  messages: Message[];
}
interface Project {
  id: string;
  name: string;
  timestamp: Date;
  conversations: Conversation[];
}
const ChatInterface = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const currentProject = projects.find(p => p.id === currentProjectId);
  const conversations = currentProject?.conversations || [];
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowBackToTop(container.scrollTop > 300);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    messagesContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    // Load projects from localStorage
    const saved = localStorage.getItem("wizdom-projects");
    if (saved) {
      const parsed = JSON.parse(saved);
      const loadedProjects = parsed.map((p: any) => ({
        ...p,
        timestamp: new Date(p.timestamp),
        conversations: p.conversations.map((c: any) => ({
          ...c,
          timestamp: new Date(c.timestamp),
          messages: c.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }))
      }));
      setProjects(loadedProjects);
      if (loadedProjects.length > 0) {
        setCurrentProjectId(loadedProjects[0].id);
        if (loadedProjects[0].conversations.length > 0) {
          setCurrentConversationId(loadedProjects[0].conversations[0].id);
        }
      }
    } else {
      // Create default project if none exists
      const defaultProject: Project = {
        id: Date.now().toString(),
        name: "Default Project",
        timestamp: new Date(),
        conversations: []
      };
      setProjects([defaultProject]);
      setCurrentProjectId(defaultProject.id);
    }
  }, []);
  
  useEffect(() => {
    // Save projects to localStorage
    if (projects.length > 0) {
      localStorage.setItem("wizdom-projects", JSON.stringify(projects));
    }
  }, [projects]);
  const createNewProject = (name: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      timestamp: new Date(),
      conversations: []
    };
    setProjects(prev => [newProject, ...prev]);
    setCurrentProjectId(newProject.id);
    setCurrentConversationId(null);
    toast({
      title: "Project created",
      description: `"${name}" has been created.`
    });
  };
  
  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (currentProjectId === projectId) {
      const remaining = projects.filter(p => p.id !== projectId);
      if (remaining.length > 0) {
        setCurrentProjectId(remaining[0].id);
        setCurrentConversationId(remaining[0].conversations[0]?.id || null);
      } else {
        setCurrentProjectId(null);
        setCurrentConversationId(null);
      }
    }
  };
  
  const createNewConversation = () => {
    if (!currentProjectId) return;
    
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      timestamp: new Date(),
      preview: "Start a conversation...",
      messages: []
    };
    
    setProjects(prev => prev.map(proj => 
      proj.id === currentProjectId 
        ? { ...proj, conversations: [newConv, ...proj.conversations] }
        : proj
    ));
    setCurrentConversationId(newConv.id);
  };
  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || !currentProjectId) return;

    // Create new conversation if none exists
    let conversationId = currentConversationId;
    if (!conversationId) {
      const newConv: Conversation = {
        id: Date.now().toString(),
        title: textToSend.slice(0, 30) + (textToSend.length > 30 ? "..." : ""),
        timestamp: new Date(),
        preview: textToSend.slice(0, 50) + (textToSend.length > 50 ? "..." : ""),
        messages: []
      };
      setProjects(prev => prev.map(proj => 
        proj.id === currentProjectId 
          ? { ...proj, conversations: [newConv, ...proj.conversations] }
          : proj
      ));
      setCurrentConversationId(newConv.id);
      conversationId = newConv.id;
    } else {
      // Update title/preview if this conversation still has default "New Chat" title
      const currentConv = conversations.find(c => c.id === conversationId);
      if (currentConv && currentConv.title === "New Chat" && currentConv.messages.length === 0) {
        setProjects(prev => prev.map(proj =>
          proj.id === currentProjectId
            ? {
                ...proj,
                conversations: proj.conversations.map(conv =>
                  conv.id === conversationId
                    ? {
                        ...conv,
                        title: textToSend.slice(0, 30) + (textToSend.length > 30 ? "..." : ""),
                        preview: textToSend.slice(0, 50) + (textToSend.length > 50 ? "..." : "")
                      }
                    : conv
                )
              }
            : proj
        ));
      }
    }
    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date()
    };

    // Update conversation with user message
    setProjects(prev => prev.map(proj =>
      proj.id === currentProjectId
        ? {
            ...proj,
            conversations: proj.conversations.map(conv =>
              conv.id === conversationId
                ? { ...conv, messages: [...conv.messages, userMessage] }
                : conv
            )
          }
        : proj
    ));
    setInputMessage("");
    setIsTyping(true);
    try {
      console.log("Sending message to backend:", textToSend);
      const currentConv = conversations.find(c => c.id === conversationId);
      const conversationHistory = currentConv?.messages || [];
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: textToSend,
          conversationHistory: conversationHistory.map(msg => ({
            role: msg.isUser ? "user" : "bot",
            content: msg.text
          }))
        })
      });
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        isUser: false,
        timestamp: new Date()
      };
      setProjects(prev => prev.map(proj =>
        proj.id === currentProjectId
          ? {
              ...proj,
              conversations: proj.conversations.map(conv =>
                conv.id === conversationId
                  ? { ...conv, messages: [...conv.messages, aiMessage] }
                  : conv
              )
            }
          : proj
      ));
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setProjects(prev => prev.map(proj =>
        proj.id === currentProjectId
          ? {
              ...proj,
              conversations: proj.conversations.map(conv =>
                conv.id === conversationId
                  ? { ...conv, messages: [...conv.messages, errorMessage] }
                  : conv
              )
            }
          : proj
      ));
    } finally {
      setIsTyping(false);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleDeleteConversation = (id: string) => {
    if (!currentProjectId) return;
    
    setProjects(prev => prev.map(proj =>
      proj.id === currentProjectId
        ? { ...proj, conversations: proj.conversations.filter(c => c.id !== id) }
        : proj
    ));
    
    if (currentConversationId === id) {
      const updatedProject = projects.find(p => p.id === currentProjectId);
      const remaining = updatedProject?.conversations.filter(c => c.id !== id) || [];
      setCurrentConversationId(remaining[0]?.id || null);
    }
  };
  
  const handleClearAll = () => {
    if (!currentProjectId) return;
    
    setProjects(prev => prev.map(proj =>
      proj.id === currentProjectId
        ? { ...proj, conversations: [] }
        : proj
    ));
    setCurrentConversationId(null);
    toast({
      title: "All chats cleared",
      description: "Your chat history has been deleted."
    });
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };
  return <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-radial">
        <ChatSidebar 
          projects={projects}
          currentProjectId={currentProjectId}
          conversations={conversations} 
          currentConversationId={currentConversationId} 
          onProjectSelect={setCurrentProjectId}
          onNewProject={createNewProject}
          onDeleteProject={deleteProject}
          onConversationSelect={setCurrentConversationId} 
          onNewChat={createNewConversation} 
          onDeleteConversation={handleDeleteConversation} 
          onClearAll={handleClearAll} 
        />

        <div className="flex flex-col flex-1">
          {/* Header */}
          <header className="border-b border-border px-6 shadow-sm sticky top-0 z-10 py-[12px]" style={{
          backgroundColor: '#f0f0f0'
        }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SidebarTrigger>
                <Link to="/" className="hover:opacity-80 transition-opacity">
                  <div>
                    <h1 className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text font-bold text-left text-slate-950">Wizdom AI</h1>
                    <p className="text-sm text-muted-foreground">The future of assistance — today.</p>
                  </div>
                </Link>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </header>

          {/* Messages Container */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-6 relative">
            <div className="max-w-4xl mx-auto">
              {messages.length === 0 ? <SuggestedQuestions onQuestionClick={handleSendMessage} /> : <div className="space-y-4">
                  {messages.map(message => <ChatMessage key={message.id} message={message.text} isUser={message.isUser} timestamp={message.timestamp} />)}
                  {isTyping && <TypingIndicator />}
                </div>}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Back to Top Button */}
            {showBackToTop && (
              <Button
                onClick={scrollToTop}
                size="icon"
                className="fixed bottom-24 right-8 h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-card sticky bottom-0 px-[17px] py-[11px] mx-0 my-0">
            <div className="max-w-4xl mx-auto flex gap-3 items-end">
              <Textarea ref={textareaRef} value={inputMessage} onChange={e => setInputMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)" rows={1} className="min-h-[60px] max-h-[200px] resize-none bg-background border-border focus-visible:ring-primary transition-all mx-0 my-0 py-[18px] px-[18px]" />
              <Button onClick={() => handleSendMessage()} disabled={!inputMessage.trim() || isTyping} size="icon" className="h-[60px] w-[60px] shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>;
};
export default ChatInterface;