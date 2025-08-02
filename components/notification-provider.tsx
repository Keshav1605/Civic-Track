"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth-provider"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
  read: boolean
  actionUrl?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  requestPermission: () => Promise<boolean>
  sendNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [permissionGranted, setPermissionGranted] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    // Load notifications from localStorage
    const saved = localStorage.getItem("civictrack_notifications")
    if (saved) {
      try {
        setNotifications(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading notifications:", error)
      }
    }

    // Check notification permission
    if ("Notification" in window) {
      setPermissionGranted(Notification.permission === "granted")
    }
  }, [])

  useEffect(() => {
    // Save notifications to localStorage
    localStorage.setItem("civictrack_notifications", JSON.stringify(notifications))
  }, [notifications])

  const requestPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive",
      })
      return false
    }

    if (Notification.permission === "granted") {
      setPermissionGranted(true)
      return true
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      const granted = permission === "granted"
      setPermissionGranted(granted)

      if (granted) {
        toast({
          title: "Notifications enabled",
          description: "You'll now receive push notifications for updates.",
        })
      }

      return granted
    }

    return false
  }

  const sendNotification = (notificationData: Omit<Notification, "id" | "timestamp" | "read">) => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    }

    setNotifications((prev) => [notification, ...prev])

    // Send browser notification if permission granted and user preferences allow
    if (permissionGranted && user?.preferences.notifications.push) {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/placeholder-logo.png",
        badge: "/placeholder-logo.png",
      })
    }

    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === "error" ? "destructive" : "default",
    })
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        requestPermission,
        sendNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
