import { Bell, Check, AlertCircle, Info, Clock } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      type: 'reminder',
      title: 'Medication Reminder',
      message: 'Time to take your Aspirin (500mg). Scheduled for 2:00 PM',
      time: '30 minutes ago',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Dose Confirmed',
      message: 'You successfully took your Metformin this morning',
      time: '2 hours ago',
      icon: Check,
      color: 'from-green-500 to-emerald-500',
      read: false
    },
    {
      id: 3,
      type: 'alert',
      title: 'Low Adherence Alert',
      message: 'Your adherence rate dropped to 80% this week. Stay consistent!',
      time: '1 day ago',
      icon: AlertCircle,
      color: 'from-orange-500 to-red-500',
      read: true
    },
    {
      id: 4,
      type: 'info',
      title: 'Medication Expiring Soon',
      message: 'Your Lisinopril prescription expires in 7 days. Request a refill from your doctor.',
      time: '2 days ago',
      icon: Info,
      color: 'from-purple-500 to-pink-500',
      read: true
    },
    {
      id: 5,
      type: 'success',
      title: 'Weekly Goal Achieved',
      message: 'Great job! You achieved 95% adherence this week',
      time: '3 days ago',
      icon: Check,
      color: 'from-green-500 to-teal-500',
      read: true
    },
    {
      id: 6,
      type: 'info',
      title: 'Doctor Message',
      message: 'Your doctor added a note to your profile. Check your account for details.',
      time: '1 week ago',
      icon: Info,
      color: 'from-blue-500 to-indigo-500',
      read: true
    }
  ]

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
              {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-[#3E6FA3] flex-shrink-0 mt-1" />
              )}
            </div>
            <p className="text-xs text-gray-500 mt-3">{notification.time}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout pageTitle="Notifications" pageSubtitle="Stay updated on your medications and health">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Notification Stats */}
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
