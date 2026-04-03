import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, AlertTriangle, CheckCircle, MessageCircle } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { api } from '../services/api'
import Notification from '../components/Notification'

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)

  // Fetch caregiver alerts on mount
  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await api.getCaregiverAlerts()
      
      if (result.success) {
        // Transform API data to alert format
        const alertsData = result.data?.alerts?.map(alert => ({
          id: alert.id,
          patientId: alert.patientId,
          patient: alert.patient?.firstName + ' ' + alert.patient?.lastName || 'Unknown Patient',
          issue: alert.message,
          severity: mapSeverity(alert.severity || alert.type),
          time: formatTime(alert.createdAt),
          actionable: !alert.isRead,
          isRead: alert.isRead,
          type: alert.type
        })) || []

        setAlerts(alertsData)
      } else {
        setError(result.message || 'Failed to load alerts')
      }
    } catch (err) {
      console.error('Error fetching alerts:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const mapSeverity = (type) => {
    const severityMap = {
      'DOSE_MISSED': 'high',
      'ADHERENCE_LOW': 'medium',
      'DOSE_TAKEN': 'low',
      'WEEKLY_REPORT': 'low',
      'CAREGIVER_ALERT': 'high'
    }
    return severityMap[type] || 'medium'
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const handleMarkAsRead = async (alertId) => {
    try {
      const result = await api.markAlertRead(alertId)
      if (result.success) {
        setAlerts(alerts.map(a => a.id === alertId ? { ...a, isRead: true, actionable: false } : a))
      }
    } catch (err) {
      console.error('Error marking alert as read:', err)
    }
  }

  const handleSendReminder = async (patientId) => {
    setNotification({ message: 'Reminder sent to patient', type: 'success' })
    // In a real implementation, this would call an API to send a notification
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-green-100 text-green-800 border-green-300'
    }
  }

  const getSeverityBg = (severity, isRead) => {
    if (isRead) return 'border-l-4 border-l-gray-300 bg-gray-50'
    switch (severity) {
      case 'high': return 'border-l-4 border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-4 border-l-yellow-500 bg-yellow-50'
      default: return 'border-l-4 border-l-green-500 bg-green-50'
    }
  }

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : filter === 'actionable' 
      ? alerts.filter(a => a.actionable) 
      : alerts.filter(a => a.severity === filter)

  const unreadCount = alerts.filter(a => !a.isRead).length

  if (loading) {
    return (
      <DashboardLayout pageTitle="Patient Alerts" pageSubtitle="Patient notifications and adherence warnings">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-[#2F5B8C] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout pageTitle="Patient Alerts" pageSubtitle="Patient notifications and adherence warnings">
      {/* Notification */}
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
          <button onClick={fetchAlerts} className="ml-4 underline">Retry</button>
        </div>
      )}

      <div className="space-y-6">
        {/* Header with unread count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="text-[#2F5B8C]" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Alerts</h2>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={() => alerts.filter(a => !a.isRead).forEach(a => handleMarkAsRead(a.id))}
              className="text-sm text-[#2F5B8C] hover:underline font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              filter === 'all' ? 'bg-[#2F5B8C] text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('actionable')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              filter === 'actionable'
                ? 'bg-[#2F5B8C] text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Unread ({alerts.filter(a => !a.isRead).length})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              filter === 'high'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            High Priority
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 rounded-xl shadow-md p-6 border border-red-200">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="text-red-500" size={20} />
              <p className="text-gray-600 text-sm font-medium">High Severity</p>
            </div>
            <p className="text-3xl font-bold text-red-600">{alerts.filter(a => a.severity === 'high').length}</p>
            <p className="text-xs text-red-600 mt-2">Require immediate attention</p>
          </div>
          <div className="bg-yellow-50 rounded-xl shadow-md p-6 border border-yellow-200">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="text-yellow-500" size={20} />
              <p className="text-gray-600 text-sm font-medium">Medium Severity</p>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{alerts.filter(a => a.severity === 'medium').length}</p>
            <p className="text-xs text-yellow-600 mt-2">Monitor this week</p>
          </div>
          <div className="bg-green-50 rounded-xl shadow-md p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="text-green-500" size={20} />
              <p className="text-gray-600 text-sm font-medium">Positive Updates</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{alerts.filter(a => a.severity === 'low').length}</p>
            <p className="text-xs text-green-600 mt-2">Keep encouraging!</p>
          </div>
        </div>

        {/* Alert Cards */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
              <CheckCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Alerts</h3>
              <p className="text-gray-600">All your patients are doing well!</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className={`rounded-xl shadow-md p-6 border border-gray-200 ${getSeverityBg(alert.severity, alert.isRead)} hover:shadow-lg transition-shadow`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">{alert.patient}</h3>
                      {!alert.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#3E6FA3]"></span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{alert.issue}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{alert.time}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Link 
                    to={`/caregiver/patient/${alert.patientId}`}
                    className="px-4 py-2 rounded-lg bg-[#2F5B8C] text-white font-semibold hover:shadow-md text-sm"
                  >
                    View Patient
                  </Link>
                  {!alert.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(alert.id)}
                      className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 text-sm"
                    >
                      Mark as Read
                    </button>
                  )}
                  {alert.severity === 'high' && (
                    <button 
                      onClick={() => handleSendReminder(alert.patientId)}
                      className="px-4 py-2 rounded-lg bg-[#22C55E] text-white font-semibold hover:shadow-md text-sm flex items-center gap-2"
                    >
                      <MessageCircle size={16} />
                      Send Reminder
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
