"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, MapPin, User } from "lucide-react"

const TIMETABLE = [
  {
    day: "Monday",
    date: "2024-11-04",
    schedule: [
      {
        time: "9:00 AM - 10:30 AM",
        subject: "Web Development",
        room: "A-101",
        instructor: "Dr. John",
        color: "from-blue-500",
      },
      {
        time: "11:00 AM - 12:30 PM",
        subject: "Database Design",
        room: "B-205",
        instructor: "Prof. Sarah",
        color: "from-green-500",
      },
      {
        time: "1:30 PM - 3:00 PM",
        subject: "Data Structures",
        room: "C-303",
        instructor: "Dr. Mike",
        color: "from-purple-500",
      },
    ],
  },
  {
    day: "Tuesday",
    date: "2024-11-05",
    schedule: [
      {
        time: "10:00 AM - 11:30 AM",
        subject: "Advanced JavaScript",
        room: "A-102",
        instructor: "Dr. Emma",
        color: "from-orange-500",
      },
      {
        time: "2:00 PM - 3:30 PM",
        subject: "Cloud Computing",
        room: "D-401",
        instructor: "Prof. Alex",
        color: "from-pink-500",
      },
    ],
  },
  {
    day: "Wednesday",
    date: "2024-11-06",
    schedule: [
      {
        time: "9:00 AM - 10:30 AM",
        subject: "Web Development",
        room: "A-101",
        instructor: "Dr. John",
        color: "from-blue-500",
      },
      {
        time: "11:00 AM - 12:30 PM",
        subject: "Database Design",
        room: "B-205",
        instructor: "Prof. Sarah",
        color: "from-green-500",
      },
      {
        time: "3:00 PM - 4:30 PM",
        subject: "Algorithms",
        room: "E-501",
        instructor: "Dr. Robert",
        color: "from-red-500",
      },
    ],
  },
  {
    day: "Thursday",
    date: "2024-11-07",
    schedule: [
      {
        time: "10:00 AM - 11:30 AM",
        subject: "Advanced JavaScript",
        room: "A-102",
        instructor: "Dr. Emma",
        color: "from-orange-500",
      },
      {
        time: "1:00 PM - 2:30 PM",
        subject: "System Design",
        room: "F-601",
        instructor: "Prof. Lisa",
        color: "from-indigo-500",
      },
    ],
  },
  {
    day: "Friday",
    date: "2024-11-08",
    schedule: [
      {
        time: "9:00 AM - 10:30 AM",
        subject: "Web Development",
        room: "A-101",
        instructor: "Dr. John",
        color: "from-blue-500",
      },
      {
        time: "11:00 AM - 1:00 PM",
        subject: "Capstone Project",
        room: "Lab-01",
        instructor: "Multiple",
        color: "from-cyan-500",
      },
    ],
  },
]

export default function Timetable({ onBack }) {
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [viewMode, setViewMode] = useState("week")

  const currentDayData = TIMETABLE.find((d) => d.day === selectedDay)
  const totalClasses = TIMETABLE.reduce((sum, day) => sum + day.schedule.length, 0)
  const todayClasses = currentDayData?.schedule.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <header className="bg-white/50 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="icon" className="rounded-lg bg-transparent">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Weekly Timetable</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{totalClasses}</div>
            <div className="text-sm text-muted-foreground mt-1">Total Classes/Week</div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200">
            <div className="text-2xl font-bold text-green-600">{todayClasses}</div>
            <div className="text-sm text-muted-foreground mt-1">Classes on {selectedDay}</div>
          </Card>
          <div className="md:col-span-2 flex gap-2 items-center">
            <span className="text-sm font-medium text-foreground">View:</span>
            <Button
              onClick={() => setViewMode("week")}
              variant={viewMode === "week" ? "default" : "outline"}
              className="h-9"
            >
              Week
            </Button>
            <Button
              onClick={() => setViewMode("day")}
              variant={viewMode === "day" ? "default" : "outline"}
              className="h-9"
            >
              Day
            </Button>
          </div>
        </div>

        {/* Day Selector */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {TIMETABLE.map((dayData) => (
            <Button
              key={dayData.day}
              onClick={() => setSelectedDay(dayData.day)}
              variant={selectedDay === dayData.day ? "default" : "outline"}
              className="whitespace-nowrap"
            >
              {dayData.day}
            </Button>
          ))}
        </div>

        {viewMode === "day" ? (
          <div>
            <Card className="p-6 mb-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <h2 className="text-xl font-semibold text-foreground mb-2">{selectedDay} Schedule</h2>
              <p className="text-sm text-muted-foreground">{currentDayData?.date}</p>
            </Card>

            <div className="space-y-4">
              {currentDayData?.schedule.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No classes scheduled for {selectedDay}</p>
                </Card>
              ) : (
                currentDayData?.schedule.map((item, idx) => (
                  <Card
                    key={idx}
                    className={`p-6 border-l-4 border-l-primary hover:shadow-lg transition-all bg-gradient-to-r ${item.color}/5 to-accent/5`}
                  >
                    <div className="flex items-start gap-6">
                      <div
                        className={`px-4 py-2 rounded-lg bg-gradient-to-br ${item.color} to-accent text-white font-semibold`}
                      >
                        {item.time.split(" - ")[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-3">{item.subject}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{item.room}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>{item.instructor}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {TIMETABLE.map((dayData) => (
              <Card
                key={dayData.day}
                className={`p-6 hover:shadow-lg transition-all cursor-pointer ${
                  selectedDay === dayData.day ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedDay(dayData.day)}
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">{dayData.day}</h3>
                <div className="space-y-3">
                  {dayData.schedule.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r ${item.color}/10 to-accent/5 border border-border hover:shadow-md transition-all`}
                    >
                      <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{item.subject}</div>
                        <div className="text-sm text-muted-foreground mt-2 space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {item.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            Room: {item.room}
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3" />
                            {item.instructor}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
