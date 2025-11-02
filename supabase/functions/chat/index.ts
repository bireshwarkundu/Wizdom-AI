import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: string;
  content: string;
}

interface ChatRequest {
  question: string;
  conversationHistory?: Message[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, conversationHistory = [] }: ChatRequest = await req.json();
    
    console.log('Received question:', question);
    console.log('Conversation history length:', conversationHistory.length);

    // Handle direct responses for common interactions
    const directResponse = getDirectResponse(question);
    if (directResponse) {
      console.log('Returning direct response:', directResponse);
      return new Response(
        JSON.stringify({ answer: directResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    if (!PERPLEXITY_API_KEY) {
      throw new Error('PERPLEXITY_API_KEY is not configured');
    }

    // Build messages with conversation history
    const messages = [
      {
        role: "system",
        content: "You are Wizdom, a friendly conversational AI assistant from Wizdom AI. Your name is Wizdom and you should always identify yourself as Wizdom when asked. Never mention other AI assistants like Perplexity, Siri, Google Assistant, Alexa, or any other AI names. When users ask for links or URLs, provide the actual clickable links (like https://www.facebook.com/login). Don't be overly cautious about sharing common website URLs. Remember previous parts of our conversation and refer to them when relevant. Give natural responses like a human would in casual conversation. Avoid formal definitions, citations, or encyclopedia-style answers. Be helpful but conversational."
      }
    ];

    // Add conversation history (last 20 messages to stay within token limits)
    const recentHistory = conversationHistory.slice(-20);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role === "bot" ? "assistant" : msg.role,
        content: msg.content
      });
    }

    // Add current question
    messages.push({
      role: "user",
      content: question
    });

    console.log('Calling Perplexity API with', messages.length, 'messages');

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.8
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, errorText);
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let rawResponse = data.choices[0].message.content;
    console.log('Raw response from Perplexity:', rawResponse.substring(0, 100) + '...');

    // Process response to make it more conversational
    const processedResponse = processResponse(rawResponse, question);
    console.log('Processed response:', processedResponse.substring(0, 100) + '...');

    return new Response(
      JSON.stringify({ answer: processedResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        answer: "I'm having trouble processing your request right now. Please try again."
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function getDirectResponse(userInput: string): string | null {
  const userLower = userInput.toLowerCase().trim();
  
  // Simple greetings
  if (['hi', 'hello', 'hey', 'hi there', 'hello there'].includes(userLower)) {
    return "Hey there! What's on your mind?";
  }
  
  // How are you variations
  if (['how are you', 'how are you?', 'how do you do', 'how do you do?'].includes(userLower)) {
    return "I'm doing great, thanks for asking! How about you?";
  }
  
  // Thanks variations
  if (['thanks', 'thank you', 'thanks!', 'thank you!'].includes(userLower)) {
    return "No problem! Happy to help.";
  }
  
  // Goodbye variations
  if (['bye', 'goodbye', 'bye!', 'goodbye!', 'see you', 'see ya'].includes(userLower)) {
    return "See you later! Take care!";
  }
  
  // Identity questions
  if (['who are you', 'who are you?', 'what are you', 'what are you?', 'what is your name', "what's your name"].includes(userLower)) {
    return "I'm Wizdom, your friendly AI assistant from Wizdom AI! I'm here to help you with questions, have conversations, and assist with whatever you need. How can I help you today?";
  }
  
  return null;
}

function processResponse(response: string, originalQuestion: string): string {
  // Remove citations and references
  let processed = response.split('[')[0]; // Remove citations like [1][2]
  processed = processed.split('References:')[0]; // Remove reference sections
  
  // Replace any mentions of other AI assistants with Wizdom
  const aiNames = ['perplexity', 'siri', 'google assistant', 'alexa', 'chatgpt', 'claude', 'bard'];
  const processedLower = processed.toLowerCase();
  
  for (const aiName of aiNames) {
    if (processedLower.includes(aiName)) {
      // If asking about identity, provide Wizdom response
      if (['name', 'who are you', 'what are you'].some(word => originalQuestion.toLowerCase().includes(word))) {
        return "I'm Wizdom, your friendly AI assistant from Wizdom AI! I'm here to help you with questions, have conversations, and assist with whatever you need. How can I help you today?";
      }
      // Otherwise, replace the AI name with Wizdom
      const regex = new RegExp(aiName, 'gi');
      processed = processed.replace(regex, 'Wizdom');
    }
  }
  
  // If response is too formal/encyclopedia-like, simplify it
  if (['is a', 'refers to', 'definition', 'etymology'].some(phrase => processed.toLowerCase().includes(phrase))) {
    const sentences = processed.split('. ');
    if (sentences.length > 0) {
      const firstSentence = sentences[0];
      if (firstSentence.toLowerCase().includes('is a')) {
        return `That's ${firstSentence.toLowerCase().replace('is a', 'a')}.`;
      }
    }
  }
  
  return processed.trim();
}
