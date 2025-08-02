"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Camera, MapPin, Loader2, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface IssueClassification {
  type: string
  confidence: number
  priority: "Low" | "Medium" | "High"
  estimatedAuthority: string
}

export default function ReportPage() {
  const [step, setStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [classification, setClassification] = useState<IssueClassification | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reportId, setReportId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // Mock reverse geocoding
          setLocation({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)} (Main St & 5th Ave)`,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          // Mock location for demo
          setLocation({
            lat: 40.7128,
            lng: -74.006,
            address: "Main St & 5th Ave, Downtown",
          })
        },
      )
    } else {
      // Mock location for demo
      setLocation({
        lat: 40.7128,
        lng: -74.006,
        address: "Main St & 5th Ave, Downtown",
      })
    }
  }

  const analyzeIssue = async () => {
    setIsAnalyzing(true)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock AI classification based on description keywords
    let issueType = "General Issue"
    let priority: "Low" | "Medium" | "High" = "Medium"
    let authority = "City Maintenance Department"

    const desc = description.toLowerCase()
    if (desc.includes("pothole") || desc.includes("road") || desc.includes("street")) {
      issueType = "Road Maintenance"
      priority = "High"
      authority = "Department of Transportation"
    } else if (desc.includes("light") || desc.includes("lamp") || desc.includes("dark")) {
      issueType = "Street Lighting"
      priority = "Medium"
      authority = "Public Works Department"
    } else if (desc.includes("garbage") || desc.includes("trash") || desc.includes("waste")) {
      issueType = "Waste Management"
      priority = "Medium"
      authority = "Sanitation Department"
    } else if (desc.includes("water") || desc.includes("leak") || desc.includes("pipe")) {
      issueType = "Water Infrastructure"
      priority = "High"
      authority = "Water & Sewer Department"
    }

    setClassification({
      type: issueType,
      confidence: 0.87,
      priority,
      estimatedAuthority: authority,
    })

    setIsAnalyzing(false)
    setStep(3)
  }

  const submitReport = async () => {
    setIsSubmitting(true)

    // Simulate report submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockReportId = `CT-${Date.now().toString().slice(-6)}`
    setReportId(mockReportId)
    setIsSubmitting(false)
    setStep(4)
  }

  const getPriorityColor = (priority: string) => {
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
            <h1 className="text-2xl font-bold text-gray-900">Report Civic Issue</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > stepNum ? <CheckCircle className="w-5 h-5" /> : stepNum}
                </div>
                {stepNum < 4 && <div className={`w-16 h-1 mx-2 ${step > stepNum ? "bg-blue-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm text-gray-600">
              Step {step} of 4:{" "}
              {step === 1 ? "Capture Issue" : step === 2 ? "Add Details" : step === 3 ? "AI Analysis" : "Confirmation"}
            </span>
          </div>
        </div>

        {/* Step 1: Image and Location */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Capture the Issue</CardTitle>
              <CardDescription>Take a photo and get your location to help us understand the problem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Upload */}
              <div>
                <Label className="text-base font-medium">Photo of the Issue</Label>
                <div className="mt-2">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Issue preview"
                        className="w-full h-64 object-cover rounded-lg border-2 border-dashed border-gray-300"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-transparent"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change Photo
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-gray-600">Click to take or upload a photo</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <Label className="text-base font-medium">Location</Label>
                <div className="mt-2">
                  {location ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center text-green-800">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span className="font-medium">Location captured</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">{location.address}</p>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={getCurrentLocation} className="w-full bg-transparent">
                      <MapPin className="w-4 h-4 mr-2" />
                      Get Current Location
                    </Button>
                  )}
                </div>
              </div>

              <Button onClick={() => setStep(2)} disabled={!selectedImage || !location} className="w-full">
                Continue to Details
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Description */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Describe the Issue</CardTitle>
              <CardDescription>
                Provide details about the problem to help our AI classify and route it correctly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="description" className="text-base font-medium">
                  Issue Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail. For example: 'Large pothole on Main Street causing traffic issues' or 'Broken streetlight making the area unsafe at night'"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={analyzeIssue} disabled={!description.trim()} className="flex-1">
                  Analyze with AI
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: AI Analysis */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Results</CardTitle>
              <CardDescription>Our AI has analyzed your report and classified the issue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isAnalyzing ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-gray-600">Analyzing image and description...</p>
                </div>
              ) : (
                classification && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900">Issue Type</h4>
                        <p className="text-blue-700">{classification.type}</p>
                        <p className="text-sm text-blue-600 mt-1">
                          Confidence: {(classification.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-purple-900">Priority Level</h4>
                        <Badge className={getPriorityColor(classification.priority)}>{classification.priority}</Badge>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900">Routed to Authority</h4>
                      <p className="text-green-700">{classification.estimatedAuthority}</p>
                      <p className="text-sm text-green-600 mt-1">Based on issue type and location</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900">Report Summary</h4>
                      <div className="mt-2 space-y-2 text-sm">
                        <p>
                          <strong>Location:</strong> {location?.address}
                        </p>
                        <p>
                          <strong>Description:</strong> {description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}

              {!isAnalyzing && (
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back to Edit
                  </Button>
                  <Button onClick={submitReport} className="flex-1">
                    Submit Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <CheckCircle className="w-6 h-6 mr-2" />
                Report Submitted Successfully!
              </CardTitle>
              <CardDescription>Your civic issue has been reported and is being processed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isSubmitting ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-gray-600">Submitting your report...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Report ID: {reportId}</h3>
                    <p className="text-green-700">Save this ID to track your report status</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">Next Steps</h4>
                      <ul className="text-sm text-blue-700 mt-2 space-y-1">
                        <li>• Authority has been notified</li>
                        <li>• You'll receive SMS/Email updates</li>
                        <li>• Expected response: 2-3 business days</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900">Assigned To</h4>
                      <p className="text-purple-700 text-sm mt-1">{classification?.estimatedAuthority}</p>
                      <p className="text-purple-600 text-xs mt-1">Priority: {classification?.priority}</p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Link href="/track" className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        Track This Report
                      </Button>
                    </Link>
                    <Link href="/report" className="flex-1">
                      <Button className="w-full">Report Another Issue</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
