import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronLeft, Clock, Calendar } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'

export default function AddMedication() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '', dosage: '', frequency: 'daily',
    selectedDays: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
    time: '09:00', startDate: '', endDate: ''
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleDayChange = (day) => {
    setFormData({ ...formData, selectedDays: { ...formData.selectedDays, [day]: !formData.selectedDays[day] } })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Medicine name required'
    if (!formData.dosage.trim()) newErrors.dosage = 'Dosage required'
    if (formData.frequency === 'weekly' && !Object.values(formData.selectedDays).some(v => v)) {
      newErrors.days = 'Select at least one day'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) setTimeout(() => navigate('/schedule'), 500)
  }

  return (
    <DashboardLayout pageTitle="Add Medication" pageSubtitle="Register a new medication to your regimen">
      <div className="max-w-2xl mx-auto">
        {/* Premium Form Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2F5B8C] via-[#3E6FA3] to-[#22C55E] px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Plus className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">New Medication</h2>
                <p className="text-blue-100 text-sm">Add to your daily regimen</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
              <div className="space-y-5">
                {/* Medicine Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Medicine Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Aspirin"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                      errors.name 
                        ? 'border-red-400 bg-red-50' 
                        : 'border-gray-300 bg-white hover:border-gray-400 focus:border-[#3E6FA3] focus:ring-2 focus:ring-[#3E6FA3]/10'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                </div>

                {/* Dosage */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Dosage *</label>
                  <input 
                    type="text" 
                    name="dosage" 
                    value={formData.dosage} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 500mg, 2 tablets"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                      errors.dosage 
                        ? 'border-red-400 bg-red-50' 
                        : 'border-gray-300 bg-white hover:border-gray-400 focus:border-[#3E6FA3] focus:ring-2 focus:ring-[#3E6FA3]/10'
                    }`}
                  />
                  {errors.dosage && <p className="text-red-500 text-sm mt-2">{errors.dosage}</p>}
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Schedule</h3>
              <div className="space-y-6">
                {/* Frequency */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Frequency</label>
                  <div className="flex gap-4">
                    {[
                      { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 transition-all duration-200"
                        style={{
                          borderColor: formData.frequency === option.value ? '#3E6FA3' : '#e5e7eb',
                          backgroundColor: formData.frequency === option.value ? '#f0f4f9' : 'white'
                        }}>
                        <input 
                          type="radio" 
                          name="frequency" 
                          value={option.value} 
                          checked={formData.frequency === option.value} 
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-[#3E6FA3]" 
                        />
                        <span className="text-gray-700 font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Days Selection (Weekly Only) */}
                {formData.frequency === 'weekly' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">Select Days *</label>
                    <div className="flex flex-wrap gap-3">
                      {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day, idx) => (
                        <button 
                          key={day} 
                          type="button" 
                          onClick={() => handleDayChange(day)}
                          className={`w-12 h-12 rounded-lg font-semibold text-sm transition-all duration-200 ${
                            formData.selectedDays[day] 
                              ? 'bg-gradient-to-r from-[#2F5B8C] to-[#3E6FA3] text-white shadow-md scale-105' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                          }`}
                        >
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
                        </button>
                      ))}
                    </div>
                    {errors.days && <p className="text-red-500 text-sm mt-3">{errors.days}</p>}
                  </div>
                )}

                {/* Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Clock size={16} className="text-[#3E6FA3]" />
                    Medicine Time
                  </label>
                  <input 
                    type="time" 
                    name="time" 
                    value={formData.time} 
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white hover:border-gray-400 focus:border-[#3E6FA3] focus:ring-2 focus:ring-[#3E6FA3]/10 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Date Section */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar size={18} className="text-[#3E6FA3]" />
                Treatment Period
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <input 
                    type="date" 
                    name="startDate" 
                    value={formData.startDate} 
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white hover:border-gray-400 focus:border-[#3E6FA3] focus:ring-2 focus:ring-[#3E6FA3]/10 focus:outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date (Optional)</label>
                  <input 
                    type="date" 
                    name="endDate" 
                    value={formData.endDate} 
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white hover:border-gray-400 focus:border-[#3E6FA3] focus:ring-2 focus:ring-[#3E6FA3]/10 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-8 border-t border-gray-200">
              <button 
                type="submit" 
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#2F5B8C] to-[#3E6FA3] text-white font-semibold hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add Medication
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')} 
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ChevronLeft size={20} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
