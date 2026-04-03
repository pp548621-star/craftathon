import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import CircleProgress from '../components/CircleProgress'

export default function PatientDashboard() {
  const [medications, setMedications] = useState([
    { id: 1, name: 'Aspirin', dosage: '500mg', nextTime: '02:00 PM', status: 'pending', time: '2:00 PM' },
    { id: 2, name: 'Metformin', dosage: '1000mg', nextTime: '08:00 AM', status: 'taken', time: '8:00 AM' },
    { id: 3, name: 'Lisinopril', dosage: '10mg', nextTime: '08:00 PM', status: 'pending', time: '8:00 PM' },
    { id: 4, name: 'Atorvastatin', dosage: '20mg', nextTime: '09:00 PM', status: 'pending', time: '9:00 PM' }
  ])

  const handleTakeMedication = (id) => {
    setMedications(medications.map((med) => med.id === id ? { ...med, status: 'taken' } : med))
  }

  const handleSkipMedication = (id) => {
    setMedications(medications.map((med) => med.id === id ? { ...med, status: 'missed' } : med))
  }

  const takenCount = medications.filter((m) => m.status === 'taken').length
  const missedCount = medications.filter((m) => m.status === 'missed').length
  const adherenceRate = Math.round((takenCount / medications.length) * 100)
  const morningMeds = medications.filter((m) => m.time.includes('AM'))
  const afternoonMeds = medications.filter((m) => m.time.includes('PM') && parseInt(m.time) < 6)
  const nightMeds = medications.filter((m) => m.time.includes('PM') && parseInt(m.time) >= 8)

  const getStatusColor = (status) => {
    switch (status) {
      case 'taken': return 'bg-green-100 text-green-800 border-green-300'
      case 'missed': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }
  }

  const getStatusLabel = (status) => status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <DashboardLayout pageTitle="Dashboard" pageSubtitle="Track your medications and stay on top of your health">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#2F5B8C] via-[#3E6FA3] to-[#22C55E] rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2">Hello, Patient 👋</h2>
            <p className="text-blue-100 text-lg">Stay on track with your medications today</p>
          </div>
          <div className="hidden md:block text-6xl opacity-20">💊</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#2F5B8C] hover:shadow-lg transition-shadow">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Medications</p>
          <p className="text-3xl font-bold text-[#2F5B8C]">{medications.length}</p>
          <p className="text-xs text-gray-500 mt-3">Prescribed for you</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#22C55E] hover:shadow-lg transition-shadow">
          <p className="text-gray-600 text-sm font-medium mb-2">Taken Today</p>
          <p className="text-3xl font-bold text-[#22C55E]">{takenCount}</p>
          <p className="text-xs text-gray-500 mt-3">Out of {medications.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
          <p className="text-gray-600 text-sm font-medium mb-2">Missed Today</p>
          <p className="text-3xl font-bold text-red-500">{missedCount}</p>
          <p className="text-xs text-gray-500 mt-3">Keep it zero</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#3E6FA3] hover:shadow-lg transition-shadow">
          <p className="text-gray-600 text-sm font-medium mb-2">Adherence Rate</p>
          <p className="text-3xl font-bold text-[#3E6FA3]">{adherenceRate}%</p>
          <p className="text-xs text-gray-500 mt-3">This week</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Medications */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-[#2F5B8C]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
              </svg>
              Today's Medications
            </h3>
            <div className="space-y-4">
              {medications.map((med) => (
                <div key={med.id} className="border border-gray-200 rounded-xl p-4 hover:border-[#2F5B8C] hover:shadow-md hover:bg-blue-50/30 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{med.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{med.dosage} • Next: {med.nextTime}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(med.status)}`}>
                        {getStatusLabel(med.status)}
                      </span>
                      {med.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleTakeMedication(med.id)} className="px-4 py-2 rounded-xl bg-[#22C55E] text-white font-semibold hover:bg-[#1ea852] hover:shadow-lg active:scale-95 text-sm">
                            ✓ Take Now
                          </button>
                          <button onClick={() => handleSkipMedication(med.id)} className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 active:scale-95 text-sm">
                            Skip
                          </button>
                        </div>
                      )}
                      {med.status === 'taken' && <div className="text-[#22C55E] font-semibold text-sm">✓ Taken</div>}
                      {med.status === 'missed' && <div className="text-red-600 font-semibold text-sm">✕ Missed</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 text-center hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Weekly Adherence</h3>
            <div className="flex justify-center mb-4">
              <CircleProgress percentage={adherenceRate} size="md" />
            </div>
            <p className="text-sm text-gray-600">Keep up the great work!</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-md p-6 border border-orange-200 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <p className="text-5xl mb-2">🔥</p>
              <h3 className="text-2xl font-bold text-orange-900 mb-2">15 Day Streak</h3>
              <p className="text-sm text-orange-700 mb-4">Amazing consistency!</p>
              <div className="w-full bg-orange-200 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2.5 rounded-full" style={{ width: '75%' }} />
              </div>
              <p className="text-xs text-orange-600 mt-3 font-medium">75% to 20 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-[#2F5B8C]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
          </svg>
          Today's Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-blue-100">🌅 Morning</h4>
            <div className="space-y-3">
              {morningMeds.length > 0 ? morningMeds.map((m) => (
                <div key={m.id}><p className="font-medium text-gray-900">{m.name}</p><p className="text-gray-600 text-sm">{m.time}</p></div>
              )) : <p className="text-sm text-gray-500">No medications</p>}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-yellow-100">☀️ Afternoon</h4>
            <div className="space-y-3">
              {afternoonMeds.length > 0 ? afternoonMeds.map((m) => (
                <div key={m.id}><p className="font-medium text-gray-900">{m.name}</p><p className="text-gray-600 text-sm">{m.time}</p></div>
              )) : <p className="text-sm text-gray-500">No medications</p>}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-indigo-100">🌙 Night</h4>
            <div className="space-y-3">
              {nightMeds.length > 0 ? nightMeds.map((m) => (
                <div key={m.id}><p className="font-medium text-gray-900">{m.name}</p><p className="text-gray-600 text-sm">{m.time}</p></div>
              )) : <p className="text-sm text-gray-500">No medications</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#2F5B8C]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
            </svg>
            Weekly Summary
          </h3>
          <div className="space-y-4">
            {[{ day: 'Monday', pct: 100 }, { day: 'Tuesday', pct: 75 }, { day: 'Wednesday', pct: 100 }, { day: 'Thursday', pct: 50 }, { day: 'Friday', pct: 100 }].map((item) => (
              <div key={item.day} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0">
                <span className="text-gray-700">{item.day}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2"><div className="bg-[#22C55E] h-2 rounded-full" style={{ width: `${item.pct}%` }} /></div>
                  <span className="text-sm font-semibold text-gray-900 w-8">{item.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 border border-blue-200 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#2F5B8C]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            Insights & Tips
          </h3>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-orange-400">
              <p className="font-semibold text-gray-900 text-sm">Challenge Alert</p>
              <p className="text-sm text-gray-600 mt-2">You often miss evening doses. Set reminders!</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-[#22C55E]">
              <p className="font-semibold text-gray-900 text-sm">Achievement</p>
              <p className="text-sm text-gray-600 mt-2">87% adherence this month. Excellent!</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400">
              <p className="font-semibold text-gray-900 text-sm">Tip</p>
              <p className="text-sm text-gray-600 mt-2">Take meds with meals to reduce side effects.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
