/**
 * StaffProfile Page
 * Detailed view of individual staff member
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiBriefcase,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiEdit2,
  FiUserX,
  FiUserCheck,
  FiArrowLeft,
  FiLoader,
  FiFileText,
} from 'react-icons/fi';
import Breadcrumb from '../components/Breadcrumb';
import StaffRoleBadge from '../components/StaffRoleBadge';
import ToastContainer from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { staffService } from '../services/staffService';
import { formatStaffName, formatJoiningDate, calculateTenure } from '../utils/staffHelpers';
import { classNames } from '../utils/formatters';

export default function StaffProfile() {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toasts, success: showSuccess, error: showError, removeToast } = useToast();

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const basePath = user?.role === 'ADMIN' ? '/admin' : '/orphanage';
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    loadStaffProfile();
  }, [staffId]);

  const loadStaffProfile = async () => {
    try {
      setLoading(true);
      const response = await staffService.getById(staffId);
      setStaff(response);
    } catch (err) {
      showError(err.message || 'Failed to load staff profile');
      console.error('Error loading staff profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm('Are you sure you want to deactivate this staff member?')) return;

    try {
      setActionLoading(true);
      await staffService.deactivate(staffId);
      showSuccess('Staff member deactivated successfully');
      loadStaffProfile();
    } catch (err) {
      showError(err.message || 'Failed to deactivate staff member');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    try {
      setActionLoading(true);
      await staffService.reactivate(staffId);
      showSuccess('Staff member reactivated successfully');
      loadStaffProfile();
    } catch (err) {
      showError(err.message || 'Failed to reactivate staff member');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = () => {
    // TODO: Open Edit Modal
    showSuccess('Edit feature coming soon!');
  };

  const handleBack = () => {
    navigate(`${basePath}/staff`);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <FiLoader className="h-8 w-8 animate-spin text-civic-600" />
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={['Management', 'Staff', 'Not Found']} />
        <div className="section-card py-16">
          <div className="empty-state">
            <div className="empty-state-icon">
              <FiBriefcase className="h-6 w-6 text-slate-400" />
            </div>
            <p className="empty-state-title">Staff Member Not Found</p>
            <p className="empty-state-desc">The staff member you are looking for does not exist</p>
            <button onClick={handleBack} className="btn-primary mt-4">
              Back to Staff List
            </button>
          </div>
        </div>
      </div>
    );
  }

  const staffName = formatStaffName(staff.user);
  const tenure = calculateTenure(staff.joiningDate);

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <Breadcrumb items={['Management', 'Staff', staffName]} />

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-civic-600 dark:text-slate-400 dark:hover:text-civic-400"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to Staff List
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="section-card"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-civic-100 text-2xl font-bold text-civic-700 dark:bg-civic-500/20 dark:text-civic-300">
              {staffName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{staffName}</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{staff.designation || 'Staff Member'}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StaffRoleBadge role={staff.role} />
                {staff.isActive ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20">
                    <FiUserCheck className="h-3 w-3" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-500/20">
                    <FiUserX className="h-3 w-3" />
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleEdit}
              disabled={actionLoading}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <FiEdit2 className="h-4 w-4" />
              Edit
            </button>
            {staff.isActive ? (
              <button
                onClick={handleDeactivate}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm transition-all hover:bg-red-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-700 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                {actionLoading ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiUserX className="h-4 w-4" />}
                Deactivate
              </button>
            ) : (
              <button
                onClick={handleReactivate}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm transition-all hover:bg-emerald-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-700 dark:bg-slate-800 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
              >
                {actionLoading ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiUserCheck className="h-4 w-4" />}
                Reactivate
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="section-card"
        >
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            <FiUser className="h-5 w-5 text-civic-600 dark:text-civic-400" />
            Personal Information
          </h2>
          <div className="space-y-3">
            <InfoRow icon={FiMail} label="Email" value={staff.user?.email || 'N/A'} />
            <InfoRow icon={FiPhone} label="Phone" value={staff.user?.phone || 'N/A'} />
            <InfoRow icon={FiBriefcase} label="Employee ID" value={staff.employeeId || 'N/A'} />
          </div>
        </motion.div>

        {/* Employment Details */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="section-card"
        >
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            <FiCalendar className="h-5 w-5 text-civic-600 dark:text-civic-400" />
            Employment Details
          </h2>
          <div className="space-y-3">
            <InfoRow icon={FiCalendar} label="Joining Date" value={formatJoiningDate(staff.joiningDate)} />
            <InfoRow icon={FiCalendar} label="Tenure" value={tenure} />
            {staff.endDate && (
              <InfoRow
                icon={FiCalendar}
                label="End Date"
                value={formatJoiningDate(staff.endDate)}
                className="text-red-600 dark:text-red-400"
              />
            )}
          </div>
        </motion.div>

        {/* Orphanage Information */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="section-card"
        >
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            <FiMapPin className="h-5 w-5 text-civic-600 dark:text-civic-400" />
            Orphanage Information
          </h2>
          <div className="space-y-3">
            <InfoRow icon={FiMapPin} label="Orphanage" value={staff.orphanage?.name || 'N/A'} />
            <InfoRow icon={FiMapPin} label="City" value={staff.orphanage?.city || 'N/A'} />
            <InfoRow icon={FiMapPin} label="State" value={staff.orphanage?.state || 'N/A'} />
          </div>
        </motion.div>

        {/* Notes */}
        {staff.notes && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="section-card"
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              <FiFileText className="h-5 w-5 text-civic-600 dark:text-civic-400" />
              Notes
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">{staff.notes}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, className = '' }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className={classNames('mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500', className)} />
      <div className="flex-1">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className={classNames('mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100', className)}>
          {value}
        </p>
      </div>
    </div>
  );
}
