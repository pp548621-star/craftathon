import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'

export default function Alerts() {
  const [filter, setFilter] = useState('all')

  const alerts = [
    { id: 1, patient: 'John Smith', issue: 'Missed 2 evening doses', severity: 'high', time: '2 hours ago', actionable: true },
    { id: 2, patient: 'Sarah Johnson', issue: 'Low adherence this week (62%)', severity: 'medium', time: '4 hours ago', actionable: true },
    { id: 3, patient: 'Mike Davis', issue: 'Perfect adherence maintained', severity: 'low', time: '1 day ago', actionable: false },
    { id: 4, patient: 'Emma Wilson', issue: 'Skipped morning medication', severity: 'high', time: '30 minutes ago', actionable: true },
    { id: 5, patient: 'Robert Brown', issue: 'Adherence improving (70% → 82%)', severity: 'low', time: '3 days ago', actionable: false },
  ]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-green-100 text-green-800 border-green-300'
    }
  }

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'high': return 'border-l-4 border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-4 border-l-yellow-500 bg-yellow-50'
      default: return 'border-l-4 border-l-green-500 bg-green-50'
    }
  }

  const filteredAlerts = filter === 'all' ? alerts : filter === 'actionable' ? alerts.filter(a => a.actionable) : alerts

  return (
    <DashboardLayout pageTitle="Patient Alerts" pageSubtitle="Patient notifications and adherence warnings">
      <div className="space-y-6">
        {/* Filter Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              filter === 'all' ? 'bg-[#2F5B8C] text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('actionable')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              filter === 'actionable'
                ? 'bg-[#2F5B8C] text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Needs Action ({alerts.filter(a => a.actionable).length})
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 rounded-xl shadow-md p-6 border border-red-200">
            <p className="text-gray-600 text-sm font-medium mb-2">High Severity</p>
            <p className="text-3xl font-bold text-red-600">{alerts.filter(a => a.severity === 'high').length}</p>
            <p className="text-xs text-red-600 mt-2">Require immediate attention</p>
          </div>
          <div className="bg-yellow-50 rounded-xl shadow-md p-6 border border-yellow-200">
            <p className="text-gray-600 text-sm font-medium mb-2">Medium Severity</p>
            <p className="text-3xl font-bold text-yellow-600">{alerts.filter(a => a.severity === 'medium').length}</p>
            <p className="text-xs text-yellow-600 mt-2">Monitor this week</p>
          </div>
          <div className="bg-green-50 rounded-xl shadow-md p-6 border border-green-200">
            <p className="text-gray-600 text-sm font-medium mb-2">Positive Updates</p>
            <p className="text-3xl font-bold text-green-600">{alerts.filter(a => a.severity === 'low').length}</p>
            <p className="text-xs text-green-600 mt-2">Keep encouraging!</p>
          </div>
        </div>

        {/* Alert Cards */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className={`rounded-xl shadow-md p-6 border border-gray-200 ${getSeverityBg(alert.severity)} hover:shadow-lg transition-shadow`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{alert.patient}</h3>
                  <p className="text-gray-600 text-sm mt-1">{alert.issue}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{alert.time}</span>
                </div>
              </div>

              {alert.actionable && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="px-4 py-2 rounded-lg bg-[#2F5B8C] text-white font-semibold hover:shadow-md text-sm">
                    View Patient
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 text-sm">
                    Send Reminder
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
