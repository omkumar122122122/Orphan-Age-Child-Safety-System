import React from 'react'
import { Mail, Phone, Hash, Building, Briefcase, Calendar } from 'lucide-react'

function InfoField({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 flex items-start gap-3 transition hover:shadow-md">
      <div className="text-blue-600 bg-blue-50 rounded-md p-2">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="text-xs font-semibold uppercase text-slate-500">{label}</div>
        <div className="mt-1 font-medium text-slate-800">{value || 'Not provided'}</div>
      </div>
    </div>
  )
}

export default function ProfileInfoGrid({ user }) {
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <InfoField icon={Hash} label="Full Name" value={user.name} />
      <InfoField icon={Mail} label="Email" value={user.email} />
      <InfoField icon={Phone} label="Phone" value={user.phone} />
      <InfoField icon={Hash} label="Employee ID" value={user.employeeId} />
      <InfoField icon={Building} label="Department" value={user.department} />
      <InfoField icon={Briefcase} label="Designation" value={user.designation} />
      <InfoField icon={Calendar} label="Joining Date" value={user.joiningDate} />
    </div>
  )
}
