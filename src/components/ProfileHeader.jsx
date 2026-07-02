import React from 'react'
import { User, CheckCircle } from 'lucide-react'

export default function ProfileHeader({ user }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-6">
      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
        <User size={36} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-slate-800">{user.name}</h2>
          <span className="inline-flex items-center gap-2 text-sm text-green-600 bg-green-50 px-2 py-1 rounded-md">
            <CheckCircle size={14} />
            Active
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">{user.role} • {user.department}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-slate-500">Member since</p>
        <p className="text-sm font-medium text-slate-800">{user.joiningDate || '—'}</p>
      </div>
    </div>
  )
}
