"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, X, Clock, Zap, TrendingUp } from "lucide-react"

const QUIZ_DATA = {
  title: "Web Development Fundamentals",
  description: "Test your knowledge on HTML, CSS, and JavaScript basics",
  timeLimit: 600,
  questions: [
    {
      id: 1,
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Home Tool Markup Language",
        "Hyperlinks and Text Markup Language",
      ],
      correct: 0,
    },
    {
      id: 2,
      question: "Which CSS property is used to change text color?",
      options: ["text-color", "color", "font-color", "text-style"],
      correct: 1,
    },
    {
      id: 3,
      question: "What is the correct way to declare a variable in JavaScript?",
      options: ["var x = 5;", "v x = 5;", "variable x = 5;", "x := 5;"],
      correct: 0,
    },
    {
      id: 4,
      question: "Which of these is NOT a JavaScript data type?",
      options: ["Number", "String", "Boolean", "Character"],
      correct: 3,
    },
    {
      id: 5,
      question: "What does the querySelector method do?",
      options: [
        "Creates a new element",
        "Selects the first element matching a selector",
        "Returns all elements",
        "Removes elements from the DOM",
      ],
      correct: 1,
    },
  ],
}

export default function Quiz({ unit, subject, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUIZ_DATA.timeLimit)
  const [showReview, setShowReview] = useState(false)

  useEffect(() => {
    if (submitted || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setSubmitted(true)
          calculateScore()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [submitted])

  const calculateScore = () => {
    let correctCount = 0
    QUIZ_DATA.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) {
        correctCount++
      }
    })
    setScore(correctCount)
  }

  const handleAnswerSelect = (optionIndex) => {
    if (!submitted) {
      setAnswers({ ...answers, [currentQuestion]: optionIndex })
    }
  }

  const handleSubmitQuiz = () => {
    calculateScore()
    setSubmitted(true)
  }

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setSubmitted(false)
    setScore(0)
    setTimeLeft(QUIZ_DATA.timeLimit)
    setShowReview(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const percentage = Math.round((score / QUIZ_DATA.questions.length) * 100)
  const getPerformanceColor = (pct) => {
    if (pct >= 80) return "text-green-600"
    if (pct >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
        <header className="bg-white/50 backdrop-blur-md border-b border-border sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="outline" size="icon" className="rounded-lg bg-transparent">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Quiz Results</h1>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!showReview ? (
            <>
              {/* Score Summary */}
              <Card className="p-8 text-center bg-gradient-to-br from-primary/10 to-accent/10 mb-8">
                <div className="mb-6">
                  <div className={`text-6xl font-bold mb-4 ${getPerformanceColor(percentage)}`}>{percentage}%</div>
                  <div className="text-3xl font-semibold text-foreground">
                    {score}/{QUIZ_DATA.questions.length} Correct
                  </div>
                </div>

                {percentage >= 80 && (
                  <p className="text-lg text-green-600 mb-6">Excellent! You've mastered this topic!</p>
                )}
                {percentage >= 60 && percentage < 80 && (
                  <p className="text-lg text-yellow-600 mb-6">Good effort! Review a few concepts and try again.</p>
                )}
                {percentage < 60 && (
                  <p className="text-lg text-red-600 mb-6">Keep practicing! Review the material and retake the quiz.</p>
                )}

                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setShowReview(true)} variant="outline">
                    Review Answers
                  </Button>
                  <Button onClick={handleRetakeQuiz}>Retake Quiz</Button>
                  <Button onClick={onBack} variant="outline">
                    Back
                  </Button>
                </div>
              </Card>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 bg-green-500/10 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-muted-foreground">Correct Answers</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{score}</div>
                </Card>
                <Card className="p-6 bg-red-500/10 border-red-200">
                  <div className="flex items-center gap-3 mb-2">
                    <X className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-muted-foreground">Incorrect Answers</span>
                  </div>
                  <div className="text-3xl font-bold text-red-600">{QUIZ_DATA.questions.length - score}</div>
                </Card>
                <Card className="p-6 bg-blue-500/10 border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-muted-foreground">Time Taken</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{formatTime(QUIZ_DATA.timeLimit - timeLeft)}</div>
                </Card>
              </div>
            </>
          ) : (
            <>
              {/* Detailed Review */}
              <div className="mb-6">
                <Button onClick={() => setShowReview(false)} variant="outline" className="mb-6">
                  Back to Summary
                </Button>
              </div>

              <div className="space-y-4">
                {QUIZ_DATA.questions.map((q, idx) => (
                  <Card
                    key={q.id}
                    className={`p-6 border-l-4 ${
                      answers[idx] === q.correct
                        ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                        : "border-red-500 bg-red-50 dark:bg-red-950/20"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex-shrink-0">
                        {answers[idx] === q.correct ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <X className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-3">{q.question}</h3>
                        <div className="text-sm space-y-2">
                          <div className="text-muted-foreground">
                            <strong>Your answer:</strong> {q.options[answers[idx]]}
                          </div>
                          {answers[idx] !== q.correct && (
                            <div className="text-green-600">
                              <strong>Correct answer:</strong> {q.options[q.correct]}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  const question = QUIZ_DATA.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / QUIZ_DATA.questions.length) * 100
  const allQuestionsAnswered = Object.keys(answers).length === QUIZ_DATA.questions.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <header className="bg-white/50 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="outline" size="icon" className="rounded-lg bg-transparent">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Quiz</h1>
            </div>
            <div
              className={`flex items-center gap-2 font-semibold ${timeLeft <= 60 ? "text-red-600" : "text-foreground"}`}
            >
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <span>
              Question {currentQuestion + 1}/{QUIZ_DATA.questions.length}
            </span>
            <span>{Object.keys(answers).length} answered</span>
          </div>
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">{question.question}</h2>

          <div className="space-y-3 mb-8">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(idx)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  answers[currentQuestion] === idx
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      answers[currentQuestion] === idx ? "border-primary bg-primary" : "border-border"
                    }`}
                  >
                    {answers[currentQuestion] === idx && <div className="w-3 h-3 bg-white rounded-full" />}
                  </div>
                  <span className="font-medium text-foreground">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              variant="outline"
              className="flex-1"
            >
              Previous
            </Button>
            {currentQuestion === QUIZ_DATA.questions.length - 1 ? (
              <Button onClick={handleSubmitQuiz} disabled={!allQuestionsAnswered} className="flex-1">
                <Zap className="w-4 h-4 mr-2" />
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={() => setCurrentQuestion(currentQuestion + 1)} className="flex-1">
                Next
              </Button>
            )}
          </div>
        </Card>

        {/* Question Navigator */}
        <Card className="p-6 bg-muted/30">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Question Navigator
          </h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {QUIZ_DATA.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-8 h-8 rounded-lg font-semibold text-sm transition-all ${
                  currentQuestion === idx
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
                    : answers[idx] !== undefined
                      ? "bg-green-500/20 text-green-600 border border-green-200"
                      : "bg-muted border border-border hover:border-primary"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
