import { useState, useEffect } from 'react'
import { Bell, Check, AlertCircle, Info, Clock, Trash2, CheckCheck } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { api } from '../services/api'
import Notification from '../components/Notification'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await api.getNotifications()
      
      if (result.success) {
        // Transform API data to notification format
        const notifs = result.data?.notifications?.map(n => ({
          id: n.id,
          type: n.type?.toLowerCase() || 'info',
          title: getNotificationTitle(n.type),
          message: n.message,
          time: formatTime(n.createdAt),
          icon: getNotificationIcon(n.type),
          color: getNotificationColor(n.type),
          read: n.isRead,
          createdAt: n.createdAt
        })) || []

        setNotifications(notifs)
      } else {
        setError(result.message || 'Failed to load notifications')
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getNotificationTitle = (type) => {
    const titles = {
      'DOSE_REMINDER': 'Medication Reminder',
      'DOSE_MISSED': 'Missed Dose Alert',
      'DOSE_TAKEN': 'Dose Confirmed',
      'ADHERENCE_ALERT': 'Adherence Alert',
      'REFILL_REMINDER': 'Refill Reminder',
      'CAREGIVER_ALERT': 'Caregiver Alert',
      'WEEKLY_REPORT': 'Weekly Report Ready'
    }
    return titles[type] || 'Notification'
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'DOSE_REMINDER': return Clock
      case 'DOSE_MISSED': return AlertCircle
      case 'DOSE_TAKEN': return Check
      case 'ADHERENCE_ALERT': return AlertCircle
      case 'REFILL_REMINDER': return Info
      case 'CAREGIVER_ALERT': return AlertCircle
      case 'WEEKLY_REPORT': return Info
      default: return Bell
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'DOSE_REMINDER': return 'from-blue-500 to-cyan-500'
      case 'DOSE_MISSED': return 'from-red-500 to-pink-500'
      case 'DOSE_TAKEN': return 'from-green-500 to-emerald-500'
      case 'ADHERENCE_ALERT': return 'from-orange-500 to-red-500'
      case 'REFILL_REMINDER': return 'from-purple-500 to-pink-500'
      case 'CAREGIVER_ALERT': return 'from-orange-500 to-red-500'
      case 'WEEKLY_REPORT': return 'from-blue-500 to-indigo-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  const handleMarkAsRead = async (ids) => {
    try {
      const result = await api.markNotificationsAsRead(ids)
      if (result.success) {
        setNotifications(notifications.map(n => 
          ids.includes(n.id) ? { ...n, read: true } : n
        ))
      }
    } catch (err) {
      console.error('Error marking notifications as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id)
    if (unreadIds.length > 0) {
      await handleMarkAsRead(unreadIds)
      setToast({ message: 'All notifications marked as read', type: 'success' })
    }
  }

  const handleDelete = async (id) => {
    try {
      const result = await api.deleteNotification(id)
      if (result.success) {
        setNotifications(notifications.filter(n => n.id !== id))
        setToast({ message: 'Notification deleted', type: 'success' })
      }
    } catch (err) {
      console.error('Error deleting notification:', err)
      setToast({ message: 'Failed to delete notification', type: 'error' })
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const unreadNotifications = notifications.filter(n => !n.read)
  const readNotifications = notifications.filter(n => n.read)

  const NotificationItem = ({ notification }) => {
    const Icon = notification.icon
    return (
      <div className={`border-l-4 p-5 rounded-lg transition-all duration-300 hover:shadow-md ${
        notification.read 
          ? 'bg-gray-50 border-gray-300' 
          : 'bg-blue-50 border-blue-400 shadow-sm'
      }`}>
        <div className="flex gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${notification.color} flex items-center justify-center`}>
            <Icon className="text-white" size={24} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              </div>
              <div className="flex items-center gap-2">
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead([notification.id])}
                    className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                    title="Mark as read"
                  >
                    <Check size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">{notification.time}</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <DashboardLayout pageTitle="Notifications" pageSubtitle="Stay updated on your medications and health">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-[#2F5B8C] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout pageTitle="Notifications" pageSubtitle="Stay updated on your medications and health">
      {/* Toast */}
      {toast && (
        <Notification 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
          <button onClick={fetchNotifications} className="ml-4 underline">Retry</button>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Notification Stats & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#2F5B8C] to-[#3E6FA3] rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Notifications</p>
                <p className="text-4xl font-bold mt-2">{notifications.length}</p>
              </div>
              <Bell size={32} className="opacity-20" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Unread</p>
                <p className="text-4xl font-bold mt-2">{unreadCount}</p>
              </div>
              <AlertCircle size={32} className="opacity-20" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Read</p>
                <p className="text-4xl font-bold mt-2">{readNotifications.length}</p>
              </div>
              <Check size={32} className="opacity-20" />
            </div>
          </div>
        </div>

        {/* Mark All as Read Button */}
        {unreadCount > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-[#2F5B8C] text-white rounded-lg font-medium hover:bg-[#264a73] transition-colors"
            >
              <CheckCheck size={18} />
              Mark all as read
            </button>
          </div>
        )}

        {/* Unread Notifications */}
        {unreadNotifications.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3E6FA3]"></div>
              <h3 className="text-lg font-bold text-gray-900">Unread ({unreadCount})</h3>
            </div>
            <div className="space-y-4">
              {unreadNotifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          </div>
        )}

        {/* Read Notifications */}
        {readNotifications.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Earlier</h3>
            <div className="space-y-4">
              {readNotifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
            <Bell className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-600">You're all caught up! Check back soon.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
