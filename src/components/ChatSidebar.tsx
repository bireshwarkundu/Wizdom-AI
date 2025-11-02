import { MessageSquare, Plus, Trash2, TrashIcon, FolderPlus, Folder, CreditCard, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { isToday, isYesterday, isThisWeek, isThisMonth, format } from "date-fns";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
}
interface Project {
  id: string;
  name: string;
  timestamp: Date;
  conversations: Conversation[];
}
interface ChatSidebarProps {
  projects: Project[];
  currentProjectId: string | null;
  conversations: Conversation[];
  currentConversationId: string | null;
  onProjectSelect: (id: string) => void;
  onNewProject: (name: string) => void;
  onDeleteProject: (id: string) => void;
  onConversationSelect: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onClearAll: () => void;
}
const getDateCategory = (date: Date): string => {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date, {
    weekStartsOn: 1
  })) return "Last 7 Days";
  if (isThisMonth(date)) return "This Month";
  return format(date, "MMMM yyyy");
};
const groupConversationsByDate = (conversations: Conversation[]) => {
  const groups: Record<string, Conversation[]> = {};
  const order = ["Today", "Yesterday", "Last 7 Days", "This Month"];
  conversations.forEach(conv => {
    const category = getDateCategory(conv.timestamp);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(conv);
  });

  // Sort groups by predefined order, then alphabetically for months
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    const aIndex = order.indexOf(a);
    const bIndex = order.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return b.localeCompare(a); // Reverse alphabetical for months (newest first)
  });
  return sortedKeys.map(key => ({
    category: key,
    conversations: groups[key]
  }));
};
const ChatSidebar = ({
  projects,
  currentProjectId,
  conversations,
  currentConversationId,
  onProjectSelect,
  onNewProject,
  onDeleteProject,
  onConversationSelect,
  onNewChat,
  onDeleteConversation,
  onClearAll
}: ChatSidebarProps) => {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const groupedConversations = groupConversationsByDate(conversations);
  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      onNewProject(newProjectName.trim());
      setNewProjectName("");
      setShowNewProjectDialog(false);
    }
  };
  return <Sidebar className="border-r border-border bg-card">
      <SidebarHeader className="border-b border-border p-4 space-y-3">
        {/* Project Selector */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Select value={currentProjectId || ""} onValueChange={onProjectSelect}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select Project">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    <span className="truncate">
                      {projects.find(p => p.id === currentProjectId)?.name || "Select Project"}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {projects.map(project => <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center justify-between w-full gap-2">
                      <span className="truncate">{project.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({project.conversations.length})
                      </span>
                    </div>
                  </SelectItem>)}
              </SelectContent>
            </Select>
            
            <AlertDialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Create New Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter a name for your new project. You can organize your chats by different projects.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Input placeholder="Project name" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleCreateProject()} />
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setNewProjectName("")}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCreateProject}>
                    Create Project
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        {/* New Chat Button */}
        <Button onClick={onNewChat} disabled={!currentProjectId} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
          <Plus className="mr-2 h-5 w-5" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {conversations.length === 0 ? <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No conversations yet
            </div> : groupedConversations.map(group => <SidebarGroup key={group.category} className="mb-4">
                <SidebarGroupLabel className="text-muted-foreground px-4 py-2 text-xs font-semibold">
                  {group.category}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.conversations.map(conversation => <SidebarMenuItem key={conversation.id} className="group">
                        <div className="flex items-start gap-2 px-2 py-1.5">
                          <SidebarMenuButton onClick={() => onConversationSelect(conversation.id)} className={cn("flex-1 justify-start text-left hover:bg-muted/50 transition-colors py-3 px-3 min-h-[60px]", currentConversationId === conversation.id && "bg-muted text-primary font-medium")}>
                            <MessageSquare className="mr-3 h-4 w-4 shrink-0 mt-0.5" />
                            <div className="flex-1 overflow-hidden min-w-0">
                              <div className="truncate text-sm font-medium leading-tight mb-1">
                                {conversation.title}
                              </div>
                              <div className="truncate text-xs text-muted-foreground leading-tight">
                                {conversation.preview}
                              </div>
                            </div>
                          </SidebarMenuButton>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1" onClick={e => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </SidebarMenuItem>)}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>)}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4 space-y-2 py-[23px]">
        <Link to="/pricing">
          <Button variant="outline" className="w-full" size="sm">
            <CreditCard className="mr-2 h-4 w-4" />
            View Pricing
          </Button>
        </Link>
        
        {conversations.length > 0 && <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full" size="sm">
                <TrashIcon className="mr-2 h-4 w-4" />
                Clear All Chats
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all chat history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}. 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>}
      </SidebarFooter>
    </Sidebar>;
};
export default ChatSidebar;