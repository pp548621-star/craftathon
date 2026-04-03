import { Sun, Clock, Moon } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'

export default function Schedule() {
  const medications = [
    { id: 1, name: 'Aspirin', dosage: '500mg', time: '8:00 AM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    { id: 2, name: 'Metformin', dosage: '1000mg', time: '8:00 AM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    { id: 3, name: 'Lisinopril', dosage: '10mg', time: '8:00 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    { id: 4, name: 'Atorvastatin', dosage: '20mg', time: '9:00 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    { id: 5, name: 'Vitamin D', dosage: '2000IU', time: '12:00 PM', days: ['Mon', 'Wed', 'Fri'] },
  ]

  const getMedicationStyle = (time) => {
    const hour = parseInt(time)
    if (hour < 12) {
      return { gradient: 'from-blue-50 to-blue-100', border: 'border-blue-200' }
    }
    if (hour < 17) {
      return { gradient: 'from-amber-50 to-amber-100', border: 'border-amber-200' }
    }
    return { gradient: 'from-indigo-50 to-indigo-100', border: 'border-indigo-200' }
  }

  const getTimeBadgeStyle = (time) => {
    const hour = parseInt(time)
    if (hour < 12) return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' }
    if (hour < 17) return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' }
    return { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' }
  }

  const TimeSection = ({ title, icon: Icon, medications: meds, timeRange }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-r from-[#2F5B8C] to-[#3E6FA3]">
          <Icon className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{timeRange}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meds.map((med) => {
          const style = getMedicationStyle(med.time)
          const badgeStyle = getTimeBadgeStyle(med.time)
          return (
            <div 
              key={med.id} 
              className={`bg-gradient-to-br ${style.gradient} rounded-2xl shadow-sm hover:shadow-md border-2 ${style.border} p-6 transition-all duration-300 hover:scale-102 cursor-pointer`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900">{med.name}</h4>
                  <p className="text-gray-600 text-sm mt-1">{med.dosage}</p>
                  
                  {/* Day Pills */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {med.days.map(day => (
                      <span 
                        key={day} 
                        className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-gray-700 border border-gray-300 shadow-sm"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Time Badge */}
                <div className={`px-3 py-2 rounded-lg border-2 font-semibold text-sm whitespace-nowrap ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
                  {med.time}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <DashboardLayout pageTitle="Medication Schedule" pageSubtitle="View your complete medication timetable">
      <div className="space-y-12">
        {/* Morning Medications */}
        <TimeSection 
          title="Morning Doses" 
          icon={Sun}
          medications={medications.filter(m => parseInt(m.time) < 12)}
          timeRange="6:00 AM - 12:00 PM"
        />

        {/* Afternoon Medications */}
        <TimeSection 
          title="Afternoon Doses" 
          icon={Clock}
          medications={medications.filter(m => {
            const hour = parseInt(m.time)
            return hour >= 12 && hour < 17
          })}
          timeRange="12:00 PM - 5:00 PM"
        />

        {/* Evening Medications */}
        <TimeSection 
          title="Evening Doses" 
          icon={Moon}
          medications={medications.filter(m => {
            const hour = parseInt(m.time)
            return hour >= 17
          })}
          timeRange="5:00 PM - 11:00 PM"
        />

        {/* Weekly Overview */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-8">Weekly Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
              <div 
                key={day} 
                className="bg-gradient-to-b from-[#2F5B8C]/5 to-[#3E6FA3]/5 rounded-xl p-4 border-2 border-[#3E6FA3]/20 hover:shadow-md transition-all duration-200"
              >
                <h4 className="font-bold text-gray-900 text-center mb-4">{day.slice(0, 3)}</h4>
                <div className="space-y-2">
                  {medications.filter(m => m.days.includes(day.slice(0, 3))).map(med => (
                    <div key={med.id} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                      <p className="font-semibold text-gray-900 text-xs line-clamp-1">{med.name}</p>
                      <p className="text-gray-600 text-xs mt-1">{med.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
