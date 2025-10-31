"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send, Loader, MessageSquare, Lightbulb, RotateCcw } from "lucide-react"

const SUGGESTED_QUESTIONS = [
  "Explain JavaScript closures",
  "What is database normalization?",
  "Study tips for this unit",
  "How does the event loop work?",
]

interface ChatbotProps {
  unit?: { id: number; name: string } | null;
  onBack: () => void;
}

interface Message {
  id: number;
  type: string;
  content: string;
  isTyping?: boolean;
}

export default function Chatbot({ unit, onBack }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content: `Hi! I'm your AI assistant for ${unit?.name || "this unit"}. Feel free to ask me any questions about the course material, concepts, or assignments!`,
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [typingMessageId, setTypingMessageId] = useState<number | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Typewriter effect for bot messages
  const typeMessage = (messageId: number, fullText: string) => {
    let currentIndex = 0
    setTypingMessageId(messageId)
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, content: fullText.substring(0, currentIndex), isTyping: true }
              : msg
          )
        )
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isTyping: false } : msg
          )
        )
        setTypingMessageId(null)
      }
    }, 20) // Adjust speed here (lower = faster)
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message immediately
    const userMessage = { id: messages.length + 1, type: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setLoading(true)

    try {
      // Call the backend API
      const response = await fetch('http://localhost:8000/api/chatbot.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send',
          user_id: 1, // Replace with actual user ID from your auth system
          unit_id: unit?.id || null,
          message: currentInput
        })
      })

      const data = await response.json()
      
      if (data.bot_response) {
        const botMessageId = messages.length + 2
        const botMessage = {
          id: botMessageId,
          type: "bot",
          content: "",
          isTyping: true,
        }
        setMessages((prev) => [...prev, botMessage])
        setLoading(false)
        
        // Start typewriter effect
        typeMessage(botMessageId, data.bot_response)
      } else {
        throw new Error('No response from AI')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Fallback message if API fails
      const errorMessageId = messages.length + 2
      const errorMessage = {
        id: errorMessageId,
        type: "bot",
        content: "",
        isTyping: true,
      }
      setMessages((prev) => [...prev, errorMessage])
      setLoading(false)
      
      // Type the error message
      typeMessage(errorMessageId, "I'm having trouble connecting right now. Please try again in a moment.")
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        type: "bot",
        content: `Hi! I'm your AI assistant for ${unit?.name || "this unit"}. Feel free to ask me any questions about the course material, concepts, or assignments!`,
      },
    ])
    setInput("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 flex flex-col">
      {/* Header */}
      <header className="bg-white/50 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="outline" size="icon" className="rounded-lg bg-transparent">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AI Learning Assistant</h1>
                <p className="text-sm text-muted-foreground">{unit?.name || "Ask anything about your course"}</p>
              </div>
            </div>
            <Button onClick={handleClearChat} variant="outline" size="sm" className="gap-2 bg-transparent">
              <RotateCcw className="w-4 h-4" />
              Clear
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col overflow-hidden">
        {messages.length <= 1 && !loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">What would you like to learn?</h2>
              <p className="text-muted-foreground">Ask me anything about the course material</p>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
              {SUGGESTED_QUESTIONS.map((question, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleSuggestedQuestion(question)}
                  variant="outline"
                  className="justify-start h-auto py-3 px-4 text-left whitespace-normal"
                >
                  <Lightbulb className="w-4 h-4 mr-3 flex-shrink-0 text-accent" />
                  <span>{question}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 mb-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <Card
                  className={`max-w-xs sm:max-w-sm md:max-w-md p-4 ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-none"
                      : "bg-muted text-foreground rounded-2xl rounded-tl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                    {message.isTyping && <span className="inline-block w-1 h-4 bg-current ml-1 animate-pulse" />}
                  </p>
                </Card>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <Card className="p-4 bg-muted text-foreground rounded-2xl rounded-tl-none">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </Card>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-2 sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Ask me anything... (Shift+Enter for new line)"
            className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading || typingMessageId !== null}
          />
          <Button onClick={handleSendMessage} disabled={loading || !input.trim() || typingMessageId !== null} className="px-4">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
