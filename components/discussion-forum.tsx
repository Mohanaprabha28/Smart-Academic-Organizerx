"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ThumbsUp, MessageCircle, Send, Search, TrendingUp, Clock } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const INITIAL_DISCUSSIONS = [
  {
    id: 1,
    author: "John Doe",
    avatar: "👨‍🎓",
    title: "How to implement Redux?",
    content: "I am stuck on implementing Redux in my React application. Can someone explain the workflow?",
    timestamp: "2 hours ago",
    upvotes: 12,
    userUpvoted: false,
    comments: [
      {
        id: 1,
        author: "Sarah Smith",
        avatar: "👩‍🎓",
        content: "You need to understand actions, reducers, and store. Check the Redux documentation!",
        timestamp: "1 hour ago",
        upvotes: 5,
      },
      {
        id: 2,
        author: "Mike Johnson",
        avatar: "👨‍🏫",
        content: "Great question! I recommend following the official Redux tutorial first.",
        timestamp: "1 hour ago",
        upvotes: 3,
      },
    ],
  },
  {
    id: 2,
    author: "Emma Wilson",
    avatar: "👩‍🎓",
    title: "Query optimization tips",
    content: "What are some best practices for optimizing database queries?",
    timestamp: "4 hours ago",
    upvotes: 8,
    userUpvoted: true,
    comments: [
      {
        id: 3,
        author: "Prof. Database",
        avatar: "👨‍🏫",
        content: "Use indexes wisely, avoid N+1 queries, and always analyze execution plans.",
        timestamp: "3 hours ago",
        upvotes: 7,
      },
    ],
  },
  {
    id: 3,
    author: "Alex Chen",
    avatar: "👨‍🎓",
    title: "Cloud deployment strategies",
    content: "Should I use containers or serverless for my project?",
    timestamp: "6 hours ago",
    upvotes: 15,
    userUpvoted: false,
    comments: [],
  },
]

export default function DiscussionForum({ unit, onBack }) {
  const [discussions, setDiscussions] = useState(INITIAL_DISCUSSIONS)
  const [expandedThread, setExpandedThread] = useState(null)
  const [newPost, setNewPost] = useState("")
  const [newComments, setNewComments] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  const handleUpvote = (discussionId) => {
    setDiscussions(
      discussions.map((d) =>
        d.id === discussionId
          ? { ...d, upvotes: d.userUpvoted ? d.upvotes - 1 : d.upvotes + 1, userUpvoted: !d.userUpvoted }
          : d,
      ),
    )
  }

  const handleAddPost = () => {
    if (newPost.trim()) {
      const post = {
        id: discussions.length + 1,
        author: "You",
        avatar: "👤",
        title: newPost.split("\n")[0],
        content: newPost,
        timestamp: "now",
        upvotes: 0,
        userUpvoted: false,
        comments: [],
      }
      setDiscussions([post, ...discussions])
      setNewPost("")
    }
  }

  const handleAddComment = (discussionId) => {
    const comment = newComments[discussionId]
    if (comment && comment.trim()) {
      setDiscussions(
        discussions.map((d) =>
          d.id === discussionId
            ? {
                ...d,
                comments: [
                  ...d.comments,
                  {
                    id: d.comments.length + 1,
                    author: "You",
                    avatar: "👤",
                    content: comment,
                    timestamp: "now",
                    upvotes: 0,
                  },
                ],
              }
            : d,
        ),
      )
      setNewComments({ ...newComments, [discussionId]: "" })
    }
  }

  const filteredDiscussions = discussions.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    if (sortBy === "trending") return b.upvotes - a.upvotes
    if (sortBy === "comments") return b.comments.length - a.comments.length
    return 0
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <header className="bg-white/50 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="icon" className="rounded-lg bg-transparent">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Discussion Forum</h1>
              <p className="text-sm text-muted-foreground">{unit?.name || "All Units"}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* New Post */}
        <Card className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <h3 className="font-semibold text-foreground mb-4">Start a New Discussion</h3>
          <Textarea
            placeholder="Write your question or thought here... (First line becomes the title)"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="mb-4 h-24"
          />
          <Button onClick={handleAddPost} className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Post Discussion
          </Button>
        </Card>

        {/* Stats and Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-blue-500/10 border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{discussions.length}</div>
            <div className="text-sm text-muted-foreground">Total Discussions</div>
          </Card>
          <Card className="p-4 bg-green-500/10 border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {discussions.reduce((sum, d) => sum + d.comments.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Comments</div>
          </Card>
          <Card className="p-4 bg-purple-500/10 border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{Math.max(...discussions.map((d) => d.upvotes))}</div>
            <div className="text-sm text-muted-foreground">Most Upvoted</div>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground flex items-center">Sort by:</span>
            <Button
              onClick={() => setSortBy("recent")}
              variant={sortBy === "recent" ? "default" : "outline"}
              size="sm"
              className="gap-1"
            >
              <Clock className="w-4 h-4" />
              Recent
            </Button>
            <Button
              onClick={() => setSortBy("trending")}
              variant={sortBy === "trending" ? "default" : "outline"}
              size="sm"
              className="gap-1"
            >
              <TrendingUp className="w-4 h-4" />
              Trending
            </Button>
            <Button
              onClick={() => setSortBy("comments")}
              variant={sortBy === "comments" ? "default" : "outline"}
              size="sm"
              className="gap-1"
            >
              <MessageCircle className="w-4 h-4" />
              Most Discussed
            </Button>
          </div>
        </div>

        {/* Discussions */}
        <div className="space-y-4">
          {sortedDiscussions.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No discussions found. Try adjusting your search.</p>
            </Card>
          ) : (
            sortedDiscussions.map((discussion) => (
              <Card
                key={discussion.id}
                className={`p-6 hover:shadow-lg transition-all cursor-pointer ${
                  expandedThread === discussion.id ? "ring-2 ring-primary" : ""
                }`}
              >
                {/* Main Discussion */}
                <div
                  onClick={() => setExpandedThread(expandedThread === discussion.id ? null : discussion.id)}
                  className="flex gap-4"
                >
                  <div className="text-2xl flex-shrink-0">{discussion.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-lg">{discussion.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{discussion.content}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                          <span className="font-medium">{discussion.author}</span>
                          <span>{discussion.timestamp}</span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {discussion.comments.length} comments
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUpvote(discussion.id)
                          }}
                          variant={discussion.userUpvoted ? "default" : "outline"}
                          size="sm"
                          className="gap-1"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          {discussion.upvotes}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                {expandedThread === discussion.id && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="space-y-4 mb-4">
                      {discussion.comments.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">
                          No comments yet. Be the first to comment!
                        </p>
                      ) : (
                        discussion.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                            <span className="text-lg flex-shrink-0">{comment.avatar}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium text-foreground">{comment.author}</span>
                                  <span className="text-xs text-muted-foreground ml-2">{comment.timestamp}</span>
                                </div>
                              </div>
                              <p className="text-sm text-foreground mt-1">{comment.content}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="gap-1 text-xs flex-shrink-0">
                              <ThumbsUp className="w-3 h-3" />
                              {comment.upvotes}
                            </Button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Comment */}
                    <div className="flex gap-2 pt-4 border-t border-border">
                      <span className="text-lg flex-shrink-0">👤</span>
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={newComments[discussion.id] || ""}
                          onChange={(e) => setNewComments({ ...newComments, [discussion.id]: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground text-sm"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleAddComment(discussion.id)
                            }
                          }}
                        />
                        <Button onClick={() => handleAddComment(discussion.id)} size="sm" className="px-4">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
