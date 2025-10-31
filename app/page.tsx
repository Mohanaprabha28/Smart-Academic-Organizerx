"use client"

import { useState } from "react"
import Dashboard from "@/components/dashboard"
import Marks from "@/components/marks"
import Timetable from "@/components/timetable"
import DiscussionForum from "@/components/discussion-forum"
import Chatbot from "@/components/chatbot"
import Quiz from "@/components/quiz"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [selectedSemester, setSelectedSemester] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedUnit, setSelectedUnit] = useState(null)

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            onNavigate={(page: string) => setCurrentPage(page)}
            onSelectSemester={setSelectedSemester}
            onSelectSubject={setSelectedSubject}
            onSelectUnit={setSelectedUnit}
          />
        )
      case "marks":
        return <Marks onBack={() => setCurrentPage("dashboard")} />
      case "timetable":
        return <Timetable onBack={() => setCurrentPage("dashboard")} />
      case "forum":
        return <DiscussionForum unit={selectedUnit} onBack={() => setCurrentPage("dashboard")} />
      case "chatbot":
        return <Chatbot unit={selectedUnit} onBack={() => setCurrentPage("dashboard")} />
      case "quiz":
        return <Quiz unit={selectedUnit} subject={selectedSubject} onBack={() => setCurrentPage("dashboard")} />
      default:
        return (
          <Dashboard
            onNavigate={(page: string) => setCurrentPage(page)}
            onSelectSemester={setSelectedSemester}
            onSelectSubject={setSelectedSubject}
            onSelectUnit={setSelectedUnit}
          />
        )
    }
  }

  return (
    <main className="bg-background text-foreground relative">
      {renderPage()}
    </main>
  )
}

