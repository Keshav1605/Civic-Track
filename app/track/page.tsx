"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Search, MapPin, Calendar, CheckCircle, Clock, AlertTriangle, ArrowLeft, Bell } from "lucide-react"
import Link from "next/link"

// Mock tracking data
const mockReports = [
  {
    id: "CT-001234",
    type: "Road Maintenance",
    description: "Large pothole on Main Street causing traffic issues",
    location: "Main St & 5th Ave",
    priority: "High",
    status: "In Progress",
    reportedAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
    estimatedCompletion: "2024-01-18T17:00:00Z",
    authority: "Department of Transportation",
    updates: [
      {
        date: "2024-01-16T14:20:00Z",
        status: "In Progress",
        message: "Work crew assigned. Repair scheduled for tomorrow morning.",
        author: "DOT Dispatcher",
      },
      {
        date: "2024-01-15T11:15:00Z",
        status: "Reported",
        message: "Issue reported and classified as high priority road maintenance.",
        author: "CivicTrack AI",
      },
    ],
  },
  {
    id: "CT-001189",
    type: "Street Lighting",
    description: "Broken streetlight making area unsafe at night",
    location: "Park Avenue",
    priority: "Medium",
    status: "Resolved",
    reportedAt: "2024-01-10T15:45:00Z",
    updatedAt: "2024-01-12T09:30:00Z",
    completedAt: "2024-01-12T09:30:00Z",
    authority: "Public Works Department",
    updates: [
      {
        date: "2024-01-12T09:30:00Z",
        status: "Resolved",
        message: "Streetlight repaired and tested. Issue resolved.",
        author: "Public Works Team",
      },
      {
        date: "2024-01-11T08:00:00Z",
        status: "In Progress",
        message: "Electrician dispatched to assess and repair the streetlight.",
        author: "Public Works Dispatcher",
      },
      {
        date: "2024-01-10T16:00:00Z",
        status: "Reported",
        message: "Street lighting issue reported and routed to Public Works.",
        author: "CivicTrack AI",
      },
    ],
  },
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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Reported":
      return <AlertTriangle className="w-4 h-4" />
    case "In Progress":
      return <Clock className="w-4 h-4" />
    case "Resolved":
      return <CheckCircle className="w-4 h-4" />
    default:
      return <AlertTriangle className="w-4 h-4" />
  }
}

export default function TrackPage() {
  const [searchId, setSearchId] = useState("")
  const [searchResults, setSearchResults] = useState<typeof mockReports>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedReport, setSelectedReport] = useState<(typeof mockReports)[0] | null>(null)

  const handleSearch = async () => {
    if (!searchId.trim()) return

    setIsSearching(true)

    // Simulate API search
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const results = mockReports.filter((report) => report.id.toLowerCase().includes(searchId.toLowerCase()))

    setSearchResults(results)
    setIsSearching(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700 mr-4">
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Track Your Reports</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Your Report</CardTitle>
            <CardDescription>Enter your report ID to track the status and get updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="reportId">Report ID</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="reportId"
                    placeholder="Enter report ID (e.g., CT-001234)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} disabled={isSearching || !searchId.trim()} className="px-8">
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
            {searchResults.map((report) => (
              <Card
                key={report.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedReport(report)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        {getStatusIcon(report.status)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{report.type}</h4>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {report.location}
                        </p>
                        <p className="text-xs text-gray-500">Reported: {formatDate(report.reportedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(report.priority)}>{report.priority}</Badge>
                      <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Detailed Report View */}
        {selectedReport && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Report Details</h3>
              <Button variant="outline" onClick={() => setSelectedReport(null)}>
                Close Details
              </Button>
            </div>

            {/* Report Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{selectedReport.type}</span>
                      <Badge className={getStatusColor(selectedReport.status)}>{selectedReport.status}</Badge>
                    </CardTitle>
                    <CardDescription>Report ID: {selectedReport.id}</CardDescription>
                  </div>
                  <Badge className={getPriorityColor(selectedReport.priority)}>
                    {selectedReport.priority} Priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedReport.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedReport.location}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Assigned Authority</h4>
                    <p className="text-gray-600">{selectedReport.authority}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Reported</h4>
                    <p className="text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(selectedReport.reportedAt)}
                    </p>
                  </div>
                  {selectedReport.estimatedCompletion && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Estimated Completion</h4>
                      <p className="text-gray-600 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(selectedReport.estimatedCompletion)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Status Updates</CardTitle>
                <CardDescription>Track the progress of your report from submission to resolution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedReport.updates.map((update, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          update.status === "Resolved"
                            ? "bg-green-100"
                            : update.status === "In Progress"
                              ? "bg-yellow-100"
                              : "bg-red-100"
                        }`}
                      >
                        {getStatusIcon(update.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{update.status}</h4>
                          <span className="text-sm text-gray-500">{formatDate(update.date)}</span>
                        </div>
                        <p className="text-gray-600 mt-1">{update.message}</p>
                        <p className="text-xs text-gray-500 mt-1">By: {update.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to receive updates about this report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">SMS Notifications</p>
                      <p className="text-sm text-blue-700">Get text updates on status changes</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">Email Updates</p>
                      <p className="text-sm text-green-700">Receive detailed progress reports</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Results */}
        {searchId && searchResults.length === 0 && !isSearching && (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any reports matching "{searchId}". Please check your report ID and try again.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>Report IDs typically look like: CT-001234</p>
                <p>You can find your report ID in the confirmation email or SMS</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        {!selectedReport && (
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Common questions about tracking your civic reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Where do I find my Report ID?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Your report ID was provided when you submitted your issue. Check your confirmation email or SMS
                    message.
                  </p>

                  <h4 className="font-medium text-gray-900 mb-2">How often are reports updated?</h4>
                  <p className="text-sm text-gray-600">
                    Reports are updated in real-time as authorities take action. You'll receive notifications for major
                    status changes.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">What do the status levels mean?</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-red-100 text-red-800">Reported</Badge>
                      <span className="text-gray-600">Issue submitted and under review</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                      <span className="text-gray-600">Work has begun on the issue</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                      <span className="text-gray-600">Issue has been fixed</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
