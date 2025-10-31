"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight, BookOpen, BarChart3, Calendar, MessageSquare, Bot, Brain, Shield, LogOut } from "lucide-react"

const SEMESTERS_DATA = {
  "Semester 1": {
    subjects: {
      "Web Development": {
        units: [
          { id: 1, name: "Unit 1: HTML & CSS Basics" },
          { id: 2, name: "Unit 2: JavaScript Fundamentals" },
          { id: 3, name: "Unit 3: React Basics" },
        ],
      },
      "Database Design": {
        units: [
          { id: 4, name: "Unit 1: SQL Basics" },
          { id: 5, name: "Unit 2: Database Normalization" },
          { id: 6, name: "Unit 3: Advanced Queries" },
        ],
      },
    },
  },
  "Semester 2": {
    subjects: {
      "Advanced JavaScript": {
        units: [
          { id: 7, name: "Unit 1: Async/Await" },
          { id: 8, name: "Unit 2: Promises & Callbacks" },
          { id: 9, name: "Unit 3: Event Loop" },
        ],
      },
      "Cloud Computing": {
        units: [
          { id: 10, name: "Unit 1: AWS Basics" },
          { id: 11, name: "Unit 2: Lambda Functions" },
          { id: 12, name: "Unit 3: Deployment" },
        ],
      },
    },
  },
}

export default function Dashboard({ onNavigate, onSelectSemester, onSelectSubject, onSelectUnit }) {
  const [expandedSemester, setExpandedSemester] = useState(null)
  const [expandedSubject, setExpandedSubject] = useState(null)
  
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      try {
        // clear common auth storage keys and redirect to home/login
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } catch (e) {
        // ignore
      }
      window.location.href = "/"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <header className="bg-white/50 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">ClassHub</h1>
                <Link 
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-md transition-all hover:shadow-lg hover:scale-105 backdrop-blur-none border border-white/20"
                  style={{ WebkitFontSmoothing: 'antialiased', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                >
                  <Shield className="w-4 h-4 stroke-[2.5]" />
                  <span className="font-semibold text-xs">Admin</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                <span>Welcome, Student</span>
              </div>

              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={() => onNavigate("marks")}
            className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-sm font-medium">My Marks</span>
          </Button>
          <Button
            onClick={() => onNavigate("timetable")}
            className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <Calendar className="w-6 h-6" />
            <span className="text-sm font-medium">Timetable</span>
          </Button>
          <Button
            onClick={() => onNavigate("forum")}
            className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-sm font-medium">Discussion</span>
          </Button>
          <Button
            onClick={() => onNavigate("chatbot")}
            className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            <Bot className="w-6 h-6" />
            <span className="text-sm font-medium">Chatbot</span>
          </Button>
        </div>

        {/* Curriculum Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Curriculum</h2>
          <div className="space-y-4">
            {Object.entries(SEMESTERS_DATA).map(([semester, data]) => (
              <div key={semester} className="border border-border rounded-lg overflow-hidden bg-card">
                <button
                  onClick={() => setExpandedSemester(expandedSemester === semester ? null : semester)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">{semester}</span>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      expandedSemester === semester ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {expandedSemester === semester && (
                  <div className="border-t border-border px-6 py-4 bg-muted/20 space-y-3">
                    {Object.entries(data.subjects).map(([subject, subjectData]) => (
                      <div key={subject} className="bg-card rounded-lg border border-border">
                        <button
                          onClick={() => setExpandedSubject(expandedSubject === subject ? null : subject)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                        >
                          <span className="font-medium text-foreground">{subject}</span>
                          <ChevronRight
                            className={`w-4 h-4 text-muted-foreground transition-transform ${
                              expandedSubject === subject ? "rotate-90" : ""
                            }`}
                          />
                        </button>

                        {expandedSubject === subject && (
                          <div className="border-t border-border px-4 py-3 space-y-2 bg-muted/10">
                            {subjectData.units.map((unit) => (
                              <div
                                key={unit.id}
                                className="flex items-center justify-between p-3 rounded-md bg-background/50 hover:bg-background transition-colors"
                              >
                                <span className="text-sm text-foreground">{unit.name}</span>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => {
                                      onSelectUnit(unit)
                                      onNavigate("forum")
                                    }}
                                    size="sm"
                                    variant="outline"
                                    className="h-8"
                                  >
                                    Forum
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      onSelectUnit(unit)
                                      onNavigate("chatbot")
                                    }}
                                    size="sm"
                                    variant="outline"
                                    className="h-8"
                                  >
                                    <Bot className="w-3 h-3 mr-1" /> AI
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      onSelectUnit(unit)
                                      onNavigate("quiz")
                                    }}
                                    size="sm"
                                    variant="outline"
                                    className="h-8"
                                  >
                                    <Brain className="w-3 h-3 mr-1" /> Quiz
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
