"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, X } from "lucide-react"

interface Semester {
  id: number
  name: string
  start_date?: string
  end_date?: string
}

export function AdminSemesters() {
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null)
  const [formData, setFormData] = useState({ name: "", start_date: "", end_date: "" })

  useEffect(() => {
    fetchSemesters()
  }, [])

  const fetchSemesters = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/semesters.php')
      const data = await response.json()
      setSemesters(data)
    } catch (error) {
      console.error('Error fetching semesters:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('http://localhost:8000/api/semesters.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: editingSemester ? 'update' : 'create',
          id: editingSemester?.id,
          ...formData
        })
      })

      if (response.ok) {
        fetchSemesters()
        handleCloseModal()
      }
    } catch (error) {
      console.error('Error saving semester:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this semester?')) return

    try {
      await fetch(`http://localhost:8000/api/semesters.php?id=${id}`, {
        method: 'DELETE'
      })
      fetchSemesters()
    } catch (error) {
      console.error('Error deleting semester:', error)
    }
  }

  const handleEdit = (semester: Semester) => {
    setEditingSemester(semester)
    setFormData({
      name: semester.name,
      start_date: semester.start_date || "",
      end_date: semester.end_date || ""
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingSemester(null)
    setFormData({ name: "", start_date: "", end_date: "" })
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Semester
        </Button>
      </div>

      {/* Semesters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {semesters.map((semester) => (
          <Card key={semester.id} className="p-6 bg-white border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{semester.id}</span>
              </div>
              <div className="flex gap-1">
                <Button
                  onClick={() => handleEdit(semester)}
                  variant="ghost"
                  size="sm"
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(semester.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-4">{semester.name}</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Start Date:</span>
                <span className="font-medium text-slate-900">
                  {semester.start_date ? new Date(semester.start_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">End Date:</span>
                <span className="font-medium text-slate-900">
                  {semester.end_date ? new Date(semester.end_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {semesters.length === 0 && (
        <Card className="p-12 text-center bg-white border border-slate-200">
          <p className="text-slate-500">No semesters found</p>
        </Card>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {editingSemester ? 'Edit Semester' : 'Add New Semester'}
              </h3>
              <Button onClick={handleCloseModal} variant="ghost" size="icon">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Semester Name</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Semester 1 - Fall 2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={handleCloseModal}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {editingSemester ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
