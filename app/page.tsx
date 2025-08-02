"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Camera,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageCircle,
  ThumbsUp,
  Users,
  Bell,
  Menu,
  X,
  Shield,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/components/auth-provider"
import { useNotifications } from "@/components/notification-provider"

// Mock data for recent issues with voting
const recentIssues = [
  {
    id: "CT-001234",
    type: "Road Maintenance",
    location: "Main St & 5th Ave",
    status: "In Progress",
    reportedAt: "2 hours ago",
    priority: "High",
    votes: 23,
    verified: true,
    reportedBy: "John D.",
    verifications: 5,
    images: ["/placeholder.svg?height=100&width=100"],
  },
  {
    id: "CT-001189",
    type: "Broken Streetlight",
    location: "Park Avenue",
    status: "Reported",
    reportedAt: "4 hours ago",
    priority: "Medium",
    votes: 15,
    verified: false,
    reportedBy: "Sarah M.",
    verifications: 2,
    images: ["/placeholder.svg?height=100&width=100"],
  },
  {
    id: "CT-001156",
    type: "Garbage Overflow",
    location: "Downtown Plaza",
    status: "Resolved",
    reportedAt: "1 day ago",
    priority: "Low",
    votes: 8,
    verified: true,
    reportedBy: "Mike R.",
    verifications: 8,
    images: ["/placeholder.svg?height=100&width=100"],
  },
]

const stats = [
  { label: "Total Reports", value: "1,247", icon: AlertTriangle, color: "text-blue-600" },
  { label: "In Progress", value: "89", icon: Clock, color: "text-yellow-600" },
  { label: "Resolved", value: "1,158", icon: CheckCircle, color: "text-green-600" },
  { label: "Community Votes", value: "3,421", icon: ThumbsUp, color: "text-purple-600" },
]

function getStatusColor(status: string) {
  switch (status) {
    case "Reported":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
    case "In Progress":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
    case "Resolved":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
    case "Low":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }
}

export default function HomePage() {
  const { user } = useAuth()
  const { unreadCount } = useNotifications()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [votedIssues, setVotedIssues] = useState<Set<string>>(new Set())
  const [verifiedIssues, setVerifiedIssues] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Load voted issues
    const voted = localStorage.getItem("civictrack_voted")
    if (voted) {
      setVotedIssues(new Set(JSON.parse(voted)))
    }

    // Load verified issues
    const verified = localStorage.getItem("civictrack_verified")
    if (verified) {
      setVerifiedIssues(new Set(JSON.parse(verified)))
    }
  }, [])

  const handleVote = (issueId: string) => {
    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    const newVotedIssues = new Set(votedIssues)
    if (votedIssues.has(issueId)) {
      newVotedIssues.delete(issueId)
    } else {
      newVotedIssues.add(issueId)
    }

    setVotedIssues(newVotedIssues)
    localStorage.setItem("civictrack_voted", JSON.stringify(Array.from(newVotedIssues)))
  }

  const handleVerify = (issueId: string) => {
    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    const newVerifiedIssues = new Set(verifiedIssues)
    if (verifiedIssues.has(issueId)) {
      newVerifiedIssues.delete(issueId)
    } else {
      newVerifiedIssues.add(issueId)
    }

    setVerifiedIssues(newVerifiedIssues)
    localStorage.setItem("civictrack_verified", JSON.stringify(Array.from(newVerifiedIssues)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CivicTrack</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <ThemeToggle />

              <Link href="/chat">
                <Button variant="ghost" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  AI Assistant
                </Button>
              </Link>

              <Link href="/analytics">
                <Button variant="ghost" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </Link>

              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Button variant="ghost" size="sm">
                      <Bell className="w-4 h-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </div>

                  <Link href="/report">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Camera className="w-4 h-4 mr-2" />
                      Report Issue
                    </Button>
                  </Link>

                  <div className="flex items-center space-x-2">
                    <Link href="/profile">
                      <Avatar className="w-8 h-8 cursor-pointer">
                        <AvatarImage src={user.avatar || "/placeholder-user.jpg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/auth/login">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="space-y-2">
                <ThemeToggle variant="ghost" size="sm" className="w-full justify-start" />

                <Link href="/chat" className="block">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    AI Assistant
                  </Button>
                </Link>

                <Link href="/analytics" className="block">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </Link>

                {user ? (
                  <>
                    <Link href="/report" className="block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Camera className="w-4 h-4 mr-2" />
                        Report Issue
                      </Button>
                    </Link>
                    <Link href="/profile" className="block">
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="block">
                      <Button variant="outline" className="w-full bg-transparent">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup" className="block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">AI-Powered Civic Issue Reporting</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Report local problems like potholes, broken lights, or garbage issues. Our AI automatically classifies and
            routes your report to the right authorities. Join the community in making your city better!
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href={user ? "/report" : "/auth/signup"}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Camera className="w-5 h-5 mr-2" />
                Report an Issue
              </Button>
            </Link>
            <Link href="/chat">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                <MessageCircle className="w-5 h-5 mr-2" />
                Ask AI Assistant
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="dark:bg-gray-700 dark:border-gray-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Issues with Voting and Verification */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Issues</h3>
            <Link href="/dashboard">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid gap-4">
            {recentIssues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Issue Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={issue.images[0] || "/placeholder.svg"}
                        alt="Issue"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Issue Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{issue.type}</h4>
                            {issue.verified && (
                              <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                <Shield className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {issue.location}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Reported by {issue.reportedBy}</span>
                            <span>•</span>
                            <span>{issue.reportedAt}</span>
                          </div>
                        </div>

                        {/* Status and Priority Badges */}
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                            <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4">
                          {/* Voting */}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(issue.id)}
                              className={`p-2 ${votedIssues.has(issue.id) ? "text-blue-600" : "text-gray-500"}`}
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                              {issue.votes + (votedIssues.has(issue.id) ? 1 : 0)}
                            </span>
                          </div>

                          {/* Verification */}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerify(issue.id)}
                              className={`p-2 ${verifiedIssues.has(issue.id) ? "text-green-600" : "text-gray-500"}`}
                            >
                              <Shield className="w-4 h-4" />
                            </Button>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                              {issue.verifications + (verifiedIssues.has(issue.id) ? 1 : 0)}
                            </span>
                          </div>
                        </div>

                        <Link href={`/track?id=${issue.id}`}>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How CivicTrack Works</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Multi-agent AI automation for efficient civic issue resolution
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-6 h-6 mr-2 text-blue-600" />
                  Report with AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Take photos/videos and describe the issue. Our multi-agent AI system automatically classifies the
                  problem type, priority level, and routes it to the right authority.
                </p>
              </CardContent>
            </Card>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ThumbsUp className="w-6 h-6 mr-2 text-green-600" />
                  Community Voting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Citizens can vote on reported issues to help prioritize repairs. Issues with more community support
                  get higher priority and faster resolution.
                </p>
              </CardContent>
            </Card>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-purple-600" />
                  Smart Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Get real-time updates via push notifications, SMS, or email as your issue moves from reported to
                  resolved. Track progress with visual timelines.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 bg-blue-600 dark:bg-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Join the Civic Community</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Sign up today to start reporting issues, voting on community priorities, and making your city better with
              AI-powered civic engagement.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
