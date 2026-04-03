import { Flame, Pill, Check, X, TrendingUp, AlertCircle } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import CircleProgress from '../components/CircleProgress'

export default function Adherence() {
  const adherenceRate = 85
  const currentStreak = 15
  const dosesThisMonth = 42
  const missedDoses = 8
  const monthlyTrend = [
    { month: 'January', adherence: 72 },
    { month: 'February', adherence: 78 },
    { month: 'March', adherence: 85 }
  ]

  const StatCard = ({ icon: Icon, label, value, subtext, gradient }) => (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-md border border-gray-200/50 p-6 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-white/30 backdrop-blur-sm">
          <Icon size={24} className="text-white" />
        </div>
      </div>
      <p className="text-white/80 text-sm font-medium mb-2">{label}</p>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-white/70 text-xs">{subtext}</p>
    </div>
  )

  return (
    <DashboardLayout pageTitle="Adherence Report" pageSubtitle="Monitor your medication compliance and progress">
      <div className="space-y-8">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 text-center transition-all duration-300 hover:shadow-lg">
            <div className="flex justify-center mb-4">
              <CircleProgress percentage={adherenceRate} size="sm" />
            </div>
            <p className="text-gray-600 text-sm font-medium">Overall Adherence</p>
            <p className="text-3xl font-bold text-[#2F5B8C] mt-3">{adherenceRate}%</p>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </div>

          <StatCard 
            icon={Flame}
            label="Current Streak"
            value={`${currentStreak}d`}
            subtext="Days in a row"
            gradient="from-orange-500 to-red-500"
          />

          <StatCard 
            icon={Check}
            label="Doses Taken"
            value={dosesThisMonth}
            subtext={`Out of 50 scheduled`}
            gradient="from-emerald-500 to-teal-500"
          />

          <StatCard 
            icon={X}
            label="Missed Doses"
            value={missedDoses}
            subtext="Keep improving!"
            gradient="from-red-500 to-pink-500"
          />
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-gradient-to-r from-[#2F5B8C] to-[#3E6FA3]">
              <TrendingUp className="text-white" size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Monthly Trend</h3>
          </div>
          <div className="space-y-6">
            {monthlyTrend.map((item) => (
              <div key={item.month}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">{item.month}</span>
                  <span className="font-bold text-[#2F5B8C] bg-blue-50 px-3 py-1 rounded-lg text-sm">{item.adherence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-sm">
                  <div 
                    className="bg-gradient-to-r from-[#2F5B8C] via-[#3E6FA3] to-[#22C55E] h-4 rounded-full transition-all duration-500" 
                    style={{ width: `${item.adherence}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Time-based Adherence */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-8">Adherence by Time</h3>
            <div className="space-y-6">
              {[
                { label: 'Morning', emoji: '🌅', percentage: 95, color: 'from-blue-500 to-cyan-500' },
                { label: 'Afternoon', emoji: '☀️', percentage: 80, color: 'from-amber-500 to-orange-500' },
                { label: 'Evening', emoji: '🌙', percentage: 70, color: 'from-indigo-500 to-purple-500' }
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900">{item.label}</span>
                    <span className="font-bold text-white bg-gradient-to-r px-3 py-1 rounded-lg text-sm" style={{background: `linear-gradient(to right, var(--color-start), var(--color-end))`}}>
                      <span className={`bg-gradient-to-r ${item.color} bg-clip-text text-transparent font-bold`}>
                        {item.percentage}%
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-sm">
                    <div 
                      className={`bg-gradient-to-r ${item.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-gradient-to-br from-[#2F5B8C]/5 to-[#3E6FA3]/5 rounded-2xl shadow-md border border-[#3E6FA3]/20 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-gradient-to-r from-[#2F5B8C] to-[#3E6FA3]">
                <AlertCircle className="text-white" size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Key Insights</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-all">
                <p className="font-semibold text-gray-900 text-sm mb-2">⚠️ Challenge Alert</p>
                <p className="text-sm text-gray-600">You often miss evening doses after 8 PM. Consider setting phone reminders.</p>
              </div>
              <div className="bg-white rounded-xl p-5 border-l-4 border-emerald-500 shadow-sm hover:shadow-md transition-all">
                <p className="font-semibold text-gray-900 text-sm mb-2">✓ Strong Pattern</p>
                <p className="text-sm text-gray-600">Morning adherence is excellent at 95%. Keep this routine!</p>
              </div>
              <div className="bg-white rounded-xl p-5 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-all">
                <p className="font-semibold text-gray-900 text-sm mb-2">💡 Recommendation</p>
                <p className="text-sm text-gray-600">Pair evening meds with dinner. This helps 80% of users improve adherence.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Medication Adherence */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-gradient-to-r from-[#2F5B8C] to-[#3E6FA3]">
              <Pill className="text-white" size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Medication-wise Adherence</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Aspirin', adherence: 92, doses: '46/50', color: 'from-[#2F5B8C]' },
              { name: 'Metformin', adherence: 88, doses: '44/50', color: 'from-cyan-500' },
              { name: 'Lisinopril', adherence: 75, doses: '37/50', color: 'from-indigo-500' }
            ].map((med) => (
              <div key={med.name} className="bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                <h4 className="font-bold text-gray-900 mb-4">{med.name}</h4>
                <div className="mb-4">
                  <p className={`text-4xl font-bold bg-gradient-to-r ${med.color} to-cyan-500 bg-clip-text text-transparent`}>
                    {med.adherence}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{med.doses} doses</p>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r ${med.color} to-cyan-500 h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${med.adherence}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
