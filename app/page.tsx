"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Camera, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"

// Mock data for recent issues
const recentIssues = [
  {
    id: "1",
    type: "Pothole",
    location: "Main St & 5th Ave",
    status: "In Progress",
    reportedAt: "2 hours ago",
    priority: "High",
  },
  {
    id: "2",
    type: "Broken Streetlight",
    location: "Park Avenue",
    status: "Reported",
    reportedAt: "4 hours ago",
    priority: "Medium",
  },
  {
    id: "3",
    type: "Garbage Overflow",
    location: "Downtown Plaza",
    status: "Resolved",
    reportedAt: "1 day ago",
    priority: "Low",
  },
]

const stats = [
  { label: "Total Reports", value: "1,247", icon: AlertTriangle, color: "text-blue-600" },
  { label: "In Progress", value: "89", icon: Clock, color: "text-yellow-600" },
  { label: "Resolved", value: "1,158", icon: CheckCircle, color: "text-green-600" },
  { label: "Avg Response Time", value: "2.3 days", icon: TrendingUp, color: "text-purple-600" },
]

function getStatusColor(status: string) {
  switch (status) {
    case "Reported":
      return "bg-red-100 text-red-800"
    case "In Progress":
      return "bg-yellow-100 text-yellow-800"
    case "Resolved":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800"
    case "Medium":
      return "bg-yellow-100 text-yellow-800"
    case "Low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">CivicTrack</h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/report">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Camera className="w-4 h-4 mr-2" />
                  Report Issue
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Authority Dashboard</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Civic Issue Reporting</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Report local problems like potholes, broken lights, or garbage issues. Our AI automatically classifies and
            routes your report to the right authorities.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/report">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Camera className="w-5 h-5 mr-2" />
                Report an Issue
              </Button>
            </Link>
            <Link href="/track">
              <Button size="lg" variant="outline">
                Track My Reports
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Issues */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Issues</h3>
          <div className="grid gap-4">
            {recentIssues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{issue.type}</h4>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {issue.location}
                        </p>
                        <p className="text-xs text-gray-500">{issue.reportedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                      <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How CivicTrack Works</h3>
            <p className="text-lg text-gray-600">AI-powered automation for efficient civic issue resolution</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-6 h-6 mr-2 text-blue-600" />
                  Report with AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Take a photo and describe the issue. Our AI automatically classifies the problem type and priority
                  level.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-green-600" />
                  Smart Routing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Issues are automatically routed to the correct local authority based on location and issue type.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-purple-600" />
                  Track Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get real-time updates via SMS/Email as your issue moves from reported to resolved.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
