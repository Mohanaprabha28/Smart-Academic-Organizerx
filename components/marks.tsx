"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Award } from "lucide-react"

const MARKS_DATA = {
  "Web Development": [
    { assessment: "Unit Test 1", marks: 85, total: 100, percentage: 85, date: "2024-09-15" },
    { assessment: "Assignment 1", marks: 90, total: 100, percentage: 90, date: "2024-09-22" },
    { assessment: "Midterm Exam", marks: 78, total: 100, percentage: 78, date: "2024-10-05" },
    { assessment: "Project 1", marks: 92, total: 100, percentage: 92, date: "2024-10-20" },
  ],
  "Database Design": [
    { assessment: "Unit Test 1", marks: 88, total: 100, percentage: 88, date: "2024-09-16" },
    { assessment: "Assignment 1", marks: 95, total: 100, percentage: 95, date: "2024-09-23" },
    { assessment: "Midterm Exam", marks: 82, total: 100, percentage: 82, date: "2024-10-06" },
    { assessment: "Project 1", marks: 89, total: 100, percentage: 89, date: "2024-10-21" },
  ],
  "Advanced JavaScript": [
    { assessment: "Unit Test 1", marks: 80, total: 100, percentage: 80, date: "2024-09-14" },
    { assessment: "Assignment 1", marks: 87, total: 100, percentage: 87, date: "2024-09-21" },
    { assessment: "Midterm Exam", marks: 91, total: 100, percentage: 91, date: "2024-10-04" },
    { assessment: "Project 1", marks: 85, total: 100, percentage: 85, date: "2024-10-19" },
  ],
}

export default function Marks({ onBack }) {
  const [sortBy, setSortBy] = useState("date")
  const [selectedSubject, setSelectedSubject] = useState(null)

  const calculateAverage = (marks) => {
    const total = marks.reduce((sum, m) => sum + m.percentage, 0)
    return (total / marks.length).toFixed(1)
  }

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return "bg-green-500"
    if (percentage >= 80) return "bg-blue-500"
    if (percentage >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getPerformanceLabel = (percentage) => {
    if (percentage >= 90) return "Excellent"
    if (percentage >= 80) return "Good"
    if (percentage >= 70) return "Satisfactory"
    return "Needs Improvement"
  }

  const sortMarks = (marks) => {
    const sorted = [...marks]
    if (sortBy === "marks") {
      sorted.sort((a, b) => b.percentage - a.percentage)
    } else if (sortBy === "date") {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
    return sorted
  }

  const allMarks = Object.values(MARKS_DATA).flat()
  const overallAverage = (allMarks.reduce((sum, m) => sum + m.percentage, 0) / allMarks.length).toFixed(1)
  const highestMark = Math.max(...allMarks.map((m) => m.percentage))
  const lowestMark = Math.min(...allMarks.map((m) => m.percentage))

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <header className="bg-white/50 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="icon" className="rounded-lg bg-transparent">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">My Marks</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Performance */}
        <Card className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <h2 className="text-lg font-semibold text-foreground mb-4">Overall Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{overallAverage}</div>
              <div className="text-sm text-muted-foreground mt-2">Overall Average</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500">{highestMark}</div>
              <div className="text-sm text-muted-foreground mt-2">Highest Mark</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500">{lowestMark}</div>
              <div className="text-sm text-muted-foreground mt-2">Lowest Mark</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500">{Object.keys(MARKS_DATA).length}</div>
              <div className="text-sm text-muted-foreground mt-2">Subjects</div>
            </div>
          </div>
        </Card>

        {/* Sorting and Filtering Controls */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Sort by:</span>
            <Button
              onClick={() => setSortBy("date")}
              variant={sortBy === "date" ? "default" : "outline"}
              className="h-9"
            >
              Recent
            </Button>
            <Button
              onClick={() => setSortBy("marks")}
              variant={sortBy === "marks" ? "default" : "outline"}
              className="h-9"
            >
              Highest Marks
            </Button>
          </div>
        </div>

        {/* Marks by Subject */}
        <div className="space-y-6">
          {Object.entries(MARKS_DATA).map(([subject, marks]) => (
            <Card
              key={subject}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedSubject(selectedSubject === subject ? null : subject)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-foreground">{subject}</h3>
                  <Award className="w-5 h-5 text-accent" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{calculateAverage(marks)}</div>
                  <div className="text-xs text-muted-foreground">Average</div>
                </div>
              </div>

              <div className="space-y-3">
                {sortMarks(marks).map((mark, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-foreground">{mark.assessment}</div>
                      <div className="text-sm text-muted-foreground">
                        {mark.marks}/{mark.total} • {new Date(mark.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-sm">{mark.percentage}%</div>
                        <div className="text-xs text-muted-foreground">{getPerformanceLabel(mark.percentage)}</div>
                      </div>
                      <div className={`w-1 h-12 rounded-full ${getPerformanceColor(mark.percentage)}`} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>
                  Average: {calculateAverage(marks)}% across {marks.length} assessments
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
