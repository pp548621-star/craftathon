import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Calendar, Lock, Trash2, Edit2, Save, X, Bell, Smartphone, Eye } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Notification from '../components/Notification'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    bloodGroup: '',
    conditions: ''
  })

  // Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await api.getUserProfile()
      
      if (result.success && result.data?.user) {
        const userData = result.data.user
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          dateOfBirth: userData.profile?.dateOfBirth?.split('T')[0] || '',
          address: userData.profile?.address || '',
          bloodGroup: userData.profile?.bloodGroup || '',
          conditions: userData.profile?.conditions || ''
        })
      } else {
        // Fallback to localStorage user data
        if (user) {
          setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            dateOfBirth: '',
            address: '',
            bloodGroup: '',
            conditions: ''
          })
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        profile: {
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          bloodGroup: formData.bloodGroup,
          conditions: formData.conditions
        }
      }

      const result = await api.updateUserProfile(profileData)
      
      if (result.success) {
        // Update local user data
        updateUser({ ...user, ...profileData })
        setNotification({ message: 'Profile updated successfully!', type: 'success' })
        setIsEditing(false)
      } else {
        setNotification({ message: result.message || 'Failed to update profile', type: 'error' })
      }
    } catch (err) {
      console.error('Error saving profile:', err)
      setNotification({ message: 'Network error. Please try again.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  const fullName = `${formData.firstName} ${formData.lastName}`.trim()

  if (loading) {
    return (
      <DashboardLayout pageTitle="Profile" pageSubtitle="Manage your account settings and information">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-[#2F5B8C] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout pageTitle="Profile" pageSubtitle="Manage your account settings and information">
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
          <button onClick={fetchUserProfile} className="ml-4 underline">Retry</button>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-[#2F5B8C] to-[#3E6FA3] rounded-xl shadow-md p-6 text-white hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center font-bold text-2xl text-white flex-shrink-0">
              {getInitials(formData.firstName, formData.lastName)}
            </div>
            
            {/* User Info */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-1">{fullName || 'User'}</h2>
              <p className="text-white/80 text-sm">{user?.role || 'Patient'} Member</p>
              <p className="text-white/60 text-xs mt-1">{formData.email}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              isEditing
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-gradient-to-r from-[#2F5B8C] to-[#3E6FA3] text-white hover:shadow-lg'
            }`}
          >
            {isEditing ? (
              <>
                <X size={20} />
                Cancel
              </>
            ) : (
              <>
                <Edit2 size={20} />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-8 transition-all duration-300">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Personal Information</h3>

          <div className="space-y-6">
            {/* First Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-5 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                  isEditing
                    ? 'border-[#3E6FA3] bg-white focus:ring-2 focus:ring-[#3E6FA3]/10 focus:shadow-md'
                    : 'border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-5 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                  isEditing
                    ? 'border-[#3E6FA3] bg-white focus:ring-2 focus:ring-[#3E6FA3]/10 focus:shadow-md'
                    : 'border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Mail size={16} className="text-[#3E6FA3]" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled={true}
                className="w-full px-5 py-3 rounded-xl border-2 border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Phone size={16} className="text-[#3E6FA3]" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-5 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                  isEditing
                    ? 'border-[#3E6FA3] bg-white focus:ring-2 focus:ring-[#3E6FA3]/10 focus:shadow-md'
                    : 'border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-[#3E6FA3]" />
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-5 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                  isEditing
                    ? 'border-[#3E6FA3] bg-white focus:ring-2 focus:ring-[#3E6FA3]/10 focus:shadow-md'
                    : 'border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-[#3E6FA3]" />
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                rows="3"
                className={`w-full px-5 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none resize-none ${
                  isEditing
                    ? 'border-[#3E6FA3] bg-white focus:ring-2 focus:ring-[#3E6FA3]/10 focus:shadow-md'
                    : 'border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Blood Group */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-5 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                  isEditing
                    ? 'border-[#3E6FA3] bg-white focus:ring-2 focus:ring-[#3E6FA3]/10 focus:shadow-md'
                    : 'border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed'
                }`}
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            {/* Medical Conditions */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                Medical Conditions
              </label>
              <textarea
                name="conditions"
                value={formData.conditions}
                onChange={handleChange}
                disabled={!isEditing}
                rows="2"
                placeholder="e.g., Diabetes, Hypertension"
                className={`w-full px-5 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none resize-none ${
                  isEditing
                    ? 'border-[#3E6FA3] bg-white focus:ring-2 focus:ring-[#3E6FA3]/10 focus:shadow-md'
                    : 'border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white font-semibold hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={20} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h3>
          <div className="space-y-1">
            {[
              { label: 'Email Notifications', desc: 'Receive medication reminders via email', icon: Mail },
              { label: 'Push Notifications', desc: 'Receive medication reminders via browser', icon: Bell },
              { label: 'Doctor Access', desc: 'Allow your doctor to view your adherence', icon: Eye }
            ].map((setting, idx) => (
              <div key={idx} className="flex items-center justify-between py-5 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 px-4 -mx-4 transition-all">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 rounded-lg bg-gradient-to-r from-[#2F5B8C]/10 to-[#3E6FA3]/10">
                    <setting.icon className="text-[#3E6FA3]" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{setting.label}</p>
                    <p className="text-sm text-gray-600 mt-1">{setting.desc}</p>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="w-6 h-6 accent-[#3E6FA3] cursor-pointer" />
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border border-red-200 bg-red-50 rounded-xl p-5 max-w-4xl">
          <h3 className="text-red-600 font-semibold text-lg mb-2">Danger Zone</h3>
          <p className="text-red-500 text-sm mb-6">These actions cannot be undone. Please proceed with caution.</p>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-red-500 text-white font-medium hover:opacity-90 transition-opacity duration-300 flex items-center justify-center gap-2">
              <Lock size={18} />
              Change Password
            </button>
            <button className="w-full px-4 py-2 rounded-lg border border-red-300 text-red-600 font-medium hover:bg-red-100 transition-colors duration-300 flex items-center justify-center gap-2">
              <Trash2 size={18} />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
