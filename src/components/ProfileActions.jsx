import React from 'react'
import Button from './Button'
import { Edit, Key } from 'lucide-react'

export default function ProfileActions({ onEdit, onChangePassword }) {
  return (
    <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <Button variant="primary" onClick={onEdit} icon={Edit} className="flex-1 sm:flex-none">
        Edit Profile
      </Button>
      <Button variant="secondary" onClick={onChangePassword} icon={Key} className="flex-1 sm:flex-none">
        Change Password
      </Button>
    </div>
  )
}
