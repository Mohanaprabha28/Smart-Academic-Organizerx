"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, BookOpen, GraduationCap, MessageSquare, Activity } from "lucide-react"

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSubjects: 0,
    totalSemesters: 0,
    totalAssessments: 0,
    activeStudents: 0,
    growth: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  useEffect(() => {
    fetchStats()
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      // Fetch users
      const usersRes = await fetch('http://localhost:8000/api/users.php')
      const usersData = await usersRes.json()
      const totalUsers = Array.isArray(usersData) ? usersData.length : 0
      
      // Fetch subjects
      const subjectsRes = await fetch('http://localhost:8000/api/subjects.php')
      const subjectsData = await subjectsRes.json()
      const totalSubjects = Array.isArray(subjectsData) ? subjectsData.length : 0
      
      // Fetch semesters
      const semestersRes = await fetch('http://localhost:8000/api/semesters.php')
      const semestersData = await semestersRes.json()
      const totalSemesters = Array.isArray(semestersData) ? semestersData.length : 0

      // Fetch assessments (marks)
      const marksRes = await fetch('http://localhost:8000/api/marks.php')
      const marksData = await marksRes.json()
      const totalAssessments = Array.isArray(marksData) ? marksData.length : 0

      // Fetch recent chat messages for activity
      const chatRes = await fetch('http://localhost:8000/api/chatbot.php?user_id=1')
      const chatData = await chatRes.json()
      
      // Create recent activities from chat messages
      if (Array.isArray(chatData) && chatData.length > 0) {
        const activities = chatData.slice(-5).reverse().map((msg: any, idx: number) => ({
          user: usersData[idx % totalUsers]?.name || "Student",
          action: msg.type === 'user' ? 'Asked question' : 'AI responded',
          module: "Chatbot",
          time: getTimeAgo(msg.timestamp),
          status: "success"
        }))
        setRecentActivities(activities)
      } else {
        // Fallback activities if no chat data
        setRecentActivities([
          { user: "John Doe", action: "Viewed marks", module: "Assessments", time: "2 min ago", status: "success" },
          { user: "Jane Smith", action: "Updated profile", module: "Settings", time: "5 min ago", status: "success" },
          { user: "Mike Johnson", action: "Posted discussion", module: "Forum", time: "10 min ago", status: "success" },
        ])
      }

      setStats({
        totalUsers,
        totalSubjects,
        totalSemesters,
        totalAssessments,
        activeStudents: Math.floor(totalUsers * 0.8), // 80% active rate
        growth: 12
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (timestamp: string) => {
    if (!timestamp) return 'Just now'
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now.getTime() - time.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  const statCards = [
    {
      title: "Total Users",
      value: loading ? "..." : stats.totalUsers,
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Total Subjects",
      value: loading ? "..." : stats.totalSubjects,
      change: "+8%",
      trend: "up",
      icon: BookOpen,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Semesters",
      value: loading ? "..." : stats.totalSemesters,
      change: "0%",
      trend: "neutral",
      icon: GraduationCap,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Assessments",
      value: loading ? "..." : stats.totalAssessments,
      change: "+15%",
      trend: "up",
      icon: Activity,
      color: "from-orange-500 to-orange-600"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Real-time indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span className="text-sm text-slate-600">
            {loading ? 'Updating...' : 'Live Data • Auto-refresh every 30s'}
          </span>
        </div>
        <button
          onClick={fetchStats}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Refresh Now
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6 bg-white border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-slate-600"
              }`}>
                {stat.trend === "up" && <TrendingUp className="w-4 h-4" />}
                {stat.trend === "down" && <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-600">{stat.title}</p>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session by Channel */}
        <Card className="p-6 bg-white border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">User Activity</h3>
          <div className="flex items-center justify-center h-48">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#e2e8f0"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#gradient)"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray="439.8"
                  strokeDashoffset="110"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-900">75%</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {["Dashboard", "Marks", "Timetable", "Discussions", "Chatbot"].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
                <span className="text-sm font-medium text-slate-900">{75 - i * 10}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Events Chart */}
        <Card className="p-6 bg-white border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Activity Trend</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {[40, 60, 45, 70, 55, 80, 75].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <div
                  className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${height}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1 text-xs text-slate-500 text-center">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
              <span key={i}>{day}</span>
            ))}
          </div>
        </Card>

        {/* Device Stats */}
        <Card className="p-6 bg-white border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600">Uptime</span>
                <span className="font-medium text-slate-900">99.9%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-[99.9%] bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600">API Response</span>
                <span className="font-medium text-slate-900">2.3s</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600">Database Load</span>
                <span className="font-medium text-slate-900">45%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-[45%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600">Memory Usage</span>
                <span className="font-medium text-slate-900">68%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-[68%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card className="p-6 bg-white border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Recent Activities</h3>
          <span className="text-xs text-slate-500">Real-time updates</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Action</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Module</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading activities...
                    </div>
                  </td>
                </tr>
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{activity.user.charAt(0)}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-900">{activity.user}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{activity.action}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{activity.module}</td>
                    <td className="py-3 px-4 text-sm text-slate-500">{activity.time}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No recent activities
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
