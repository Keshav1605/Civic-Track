"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Clock, MapPin, Search, TrendingUp, Users, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data for authority dashboard
const issues = [
  {
    id: "CT-001234",
    type: "Road Maintenance",
    description: "Large pothole on Main Street causing traffic issues",
    location: "Main St & 5th Ave",
    priority: "High",
    status: "Reported",
    reportedAt: "2024-01-15T10:30:00Z",
    reportedBy: "John D.",
    authority: "Department of Transportation",
    estimatedResolution: "3-5 days",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "CT-001235",
    type: "Street Lighting",
    description: "Broken streetlight making area unsafe at night",
    location: "Park Avenue",
    priority: "Medium",
    status: "In Progress",
    reportedAt: "2024-01-14T15:45:00Z",
    reportedBy: "Sarah M.",
    authority: "Public Works Department",
    estimatedResolution: "2-3 days",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "CT-001236",
    type: "Waste Management",
    description: "Garbage overflow at downtown plaza",
    location: "Downtown Plaza",
    priority: "Medium",
    status: "Resolved",
    reportedAt: "2024-01-13T09:15:00Z",
    reportedBy: "Mike R.",
    authority: "Sanitation Department",
    estimatedResolution: "1-2 days",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "CT-001237",
    type: "Water Infrastructure",
    description: "Water leak causing street flooding",
    location: "Oak Street",
    priority: "High",
    status: "In Progress",
    reportedAt: "2024-01-15T08:20:00Z",
    reportedBy: "Lisa K.",
    authority: "Water & Sewer Department",
    estimatedResolution: "1-2 days",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
]

const analytics = {
  totalReports: 1247,
  pendingReports: 89,
  resolvedToday: 23,
  avgResponseTime: "2.3 days",
  topIssueTypes: [
    { type: "Road Maintenance", count: 456, percentage: 36.6 },
    { type: "Street Lighting", count: 298, percentage: 23.9 },
    { type: "Waste Management", count: 234, percentage: 18.8 },
    { type: "Water Infrastructure", count: 189, percentage: 15.2 },
    { type: "Other", count: 70, percentage: 5.6 },
  ],
}

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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || issue.status.toLowerCase() === statusFilter
    const matchesPriority = priorityFilter === "all" || issue.priority.toLowerCase() === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const updateIssueStatus = (issueId: string, newStatus: string) => {
    // In a real app, this would make an API call
    console.log(`Updating issue ${issueId} to status: ${newStatus}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700 mr-4">
                <ArrowLeft className="w-5 h-5 mr-1" />
                Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Authority Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-blue-600">
                Department of Transportation
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="issues" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="issues">Issue Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics & Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="issues" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Reports</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalReports}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.pendingReports}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.resolvedToday}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Response</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.avgResponseTime}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search by ID, description, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="reported">Reported</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Issues List */}
            <div className="space-y-4">
              {filteredIssues.map((issue) => (
                <Card key={issue.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={issue.imageUrl || "/placeholder.svg"}
                          alt="Issue"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{issue.type}</h3>
                            <p className="text-sm text-gray-600">{issue.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                            <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {issue.location}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(issue.reportedAt)}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {issue.reportedBy}
                          </span>
                        </div>

                        <div className="text-xs text-gray-500">
                          ID: {issue.id} • Est. Resolution: {issue.estimatedResolution}
                        </div>
                      </div>

                      <div className="flex-shrink-0 space-y-2">
                        {issue.status === "Reported" && (
                          <Button
                            size="sm"
                            onClick={() => updateIssueStatus(issue.id, "In Progress")}
                            className="w-full"
                          >
                            Start Work
                          </Button>
                        )}
                        {issue.status === "In Progress" && (
                          <Button
                            size="sm"
                            onClick={() => updateIssueStatus(issue.id, "Resolved")}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            Mark Resolved
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Issue Types Distribution</CardTitle>
                  <CardDescription>Most reported issue categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topIssueTypes.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-blue-600" />
                          <span className="text-sm font-medium">{item.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{item.count}</span>
                          <span className="text-xs text-gray-500">({item.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Time Insights</CardTitle>
                  <CardDescription>Performance metrics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-800">Average Response Time</span>
                      <span className="text-lg font-bold text-green-900">2.3 days</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-800">Fastest Resolution</span>
                      <span className="text-lg font-bold text-blue-900">4 hours</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium text-yellow-800">Issues This Week</span>
                      <span className="text-lg font-bold text-yellow-900">127</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-purple-800">Resolution Rate</span>
                      <span className="text-lg font-bold text-purple-900">92.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
                <CardDescription>Automated analysis and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Trending Issues</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-800">⚠️ Pothole reports increased 34% this week</p>
                        <p className="text-xs text-red-600 mt-1">Likely due to recent weather conditions</p>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800">
                          💡 Street lighting issues peak on weekends
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">Consider proactive weekend inspections</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Recommendations</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">🎯 Focus on Main St corridor</p>
                        <p className="text-xs text-blue-600 mt-1">Highest concentration of recurring issues</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-800">📱 Mobile reporting up 67%</p>
                        <p className="text-xs text-green-600 mt-1">Citizens prefer photo-based reporting</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
