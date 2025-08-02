"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Camera,
  MapPin,
  Bell,
  Shield,
  Globe,
  Palette,
  User,
  Mail,
  Calendar,
  Award,
  AlertTriangle,
  ThumbsUp,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useNotifications } from "@/components/notification-provider"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth()
  const { requestPermission } = useNotifications()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    language: "en",
    notifications: {
      push: true,
      email: true,
      sms: false,
    },
    theme: "system" as "light" | "dark" | "system",
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    setFormData({
      name: user.name,
      email: user.email,
      language: user.language,
      notifications: user.preferences.notifications,
      theme: user.preferences.theme,
    })
  }, [user, router])

  if (!user) {
    return null
  }

  const handleSave = async () => {
    const success = await updateProfile({
      name: formData.name,
      email: formData.email,
      language: formData.language,
      preferences: {
        ...user.preferences,
        notifications: formData.notifications,
        theme: formData.theme,
        language: formData.language,
      },
    })

    if (success) {
      setIsEditing(false)
    }
  }

  const handleNotificationToggle = async (type: keyof typeof formData.notifications) => {
    if (type === "push" && !formData.notifications.push) {
      const granted = await requestPermission()
      if (!granted) return
    }

    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }))
  }

  const mockStats = {
    reportsSubmitted: 12,
    issuesResolved: 8,
    communityVotes: 45,
    verificationScore: 92,
  }

  const mockRecentActivity = [
    {
      id: "1",
      type: "report",
      title: "Reported pothole on Main Street",
      date: "2024-01-15",
      status: "In Progress",
    },
    {
      id: "2",
      type: "vote",
      title: "Voted on streetlight repair",
      date: "2024-01-14",
      status: "Completed",
    },
    {
      id: "3",
      type: "verification",
      title: "Verified garbage overflow issue",
      date: "2024-01-13",
      status: "Completed",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700 mr-4">
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your personal information and account details</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="bg-transparent">
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={user.avatar || "/placeholder-user.jpg"} alt={user.name} />
                      <AvatarFallback className="text-lg">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={user.role === "authority" ? "default" : "secondary"}>
                        {user.role === "authority" ? "Authority" : "Citizen"}
                      </Badge>
                      {user.verified && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                      <Select
                        value={formData.language}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, language: value }))}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="zh">中文</SelectItem>
                          <SelectItem value="ar">العربية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md">
                      <span className="text-sm capitalize">{user.role}</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                {user.location && (
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{user.location.address}</span>
                    </div>
                  </div>
                )}

                {/* Account Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{mockStats.reportsSubmitted}</div>
                    <div className="text-xs text-blue-600">Reports</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{mockStats.issuesResolved}</div>
                    <div className="text-xs text-green-600">Resolved</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{mockStats.communityVotes}</div>
                    <div className="text-xs text-purple-600">Votes</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{mockStats.verificationScore}%</div>
                    <div className="text-xs text-orange-600">Trust Score</div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-4">
                    <Button onClick={handleSave} className="flex-1">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 bg-transparent">
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to receive updates and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Push Notifications</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Receive instant notifications in your browser
                      </p>
                    </div>
                    <Switch
                      checked={formData.notifications.push}
                      onCheckedChange={() => handleNotificationToggle("push")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Get detailed updates via email</p>
                    </div>
                    <Switch
                      checked={formData.notifications.email}
                      onCheckedChange={() => handleNotificationToggle("email")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">SMS Notifications</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Receive text messages for urgent updates
                      </p>
                    </div>
                    <Switch
                      checked={formData.notifications.sms}
                      onCheckedChange={() => handleNotificationToggle("sms")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Appearance
                </CardTitle>
                <CardDescription>Customize the look and feel of your interface</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={formData.theme}
                    onValueChange={(value: "light" | "dark" | "system") =>
                      setFormData((prev) => ({ ...prev, theme: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave}>Save Preferences</Button>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent actions and contributions to the community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        {activity.type === "report" && <AlertTriangle className="w-5 h-5 text-blue-600" />}
                        {activity.type === "vote" && <ThumbsUp className="w-5 h-5 text-blue-600" />}
                        {activity.type === "verification" && <Shield className="w-5 h-5 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{activity.date}</span>
                          <Badge variant="outline" className="text-xs">
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Achievements
                </CardTitle>
                <CardDescription>Your contributions to civic engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-300">Active Citizen</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-400">Submitted 10+ reports</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-900 dark:text-green-300">Trusted Verifier</h4>
                        <p className="text-sm text-green-700 dark:text-green-400">90%+ verification accuracy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Account Security
                </CardTitle>
                <CardDescription>Manage your account security and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Last changed 30 days ago</p>
                    </div>
                    <Button variant="outline" className="bg-transparent">
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" className="bg-transparent">
                      Enable 2FA
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium">Login Sessions</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Manage your active sessions</p>
                    </div>
                    <Button variant="outline" className="bg-transparent">
                      View Sessions
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium text-red-600">Danger Zone</h4>
                  <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
                    <div>
                      <h4 className="font-medium text-red-600">Delete Account</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button variant="outline" onClick={logout} className="bg-transparent">
                Sign Out
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
