/**
 * StaffManagement Page
 * Main page for listing and managing orphanage staff
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBriefcase, FiUsers, FiUserCheck, FiUserX, FiPlus, FiLoader } from 'react-icons/fi';
import Breadcrumb from '../components/Breadcrumb';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import StaffFilters from '../components/StaffFilters';
import StaffRoleBadge from '../components/StaffRoleBadge';
import ToastContainer from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { staffService } from '../services/staffService';
import { DEFAULT_FILTERS, DEFAULT_PAGINATION } from '../constants/staffConstants';
import { classNames } from '../utils/formatters';

const summaryConfig = [
  {
    label: 'Total Staff',
    key: 'total',
    icon: FiBriefcase,
    color: 'bg-civic-50 text-civic-700 ring-1 ring-civic-200 dark:bg-civic-500/10 dark:text-civic-300 dark:ring-civic-500/20',
  },
  {
    label: 'Active',
    key: 'active',
    icon: FiUserCheck,
    color: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20',
  },
  {
    label: 'Inactive',
    key: 'inactive',
    icon: FiUserX,
    color: 'bg-slate-50 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-500/20',
  },
  {
    label: 'Caretakers',
    key: 'caretakers',
    icon: FiUsers,
    color: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/20',
  },
];

export default function StaffManagement() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    caretakers: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toasts, success: showSuccess, error: showError, removeToast } = useToast();

  const basePath = user?.role === 'ADMIN' ? '/admin' : '/orphanage';
  const isAdmin = user?.role === 'ADMIN';

  const loadStaff = async (page = 1, searchQuery = query, currentFilters = filters) => {
    try {
      setLoading(true);
      const response = await staffService.getAll({
        search: searchQuery,
        ...currentFilters,
        page,
        limit: 10,
      });

      // Handle response envelope
      const payload = response.data ?? response;
      setData(Array.isArray(payload.data) ? payload.data : []);
      setPagination(payload.pagination ?? DEFAULT_PAGINATION);
      setSummary(
        payload.summary ?? {
          total: 0,
          active: 0,
          inactive: 0,
          caretakers: 0,
        }
      );
    } catch (err) {
      showError(err.message || 'Failed to load staff');
      console.error('Error loading staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (query !== undefined) {
        loadStaff(1, query);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [query]);

  useEffect(() => {
    loadStaff(1, query, filters);
  }, [filters]);

  const handlePageChange = (newPage) => {
    loadStaff(newPage);
  };

  const handleRowClick = (staff) => {
    navigate(`${basePath}/staff/${staff.id}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleAddStaff = () => {
    // TODO: Open Add Staff Modal
    showSuccess('Add Staff feature coming soon!');
  };

  // Format data for DataTable
  const tableData = data.map((staff) => ({
    id: staff.id,
    employeeId: staff.employeeId || 'N/A',
    name: staff.name,
    role: <StaffRoleBadge role={staff.role} size="sm" />,
    roleRaw: staff.role,
    designation: staff.designation || '-',
    joiningDate: new Date(staff.joiningDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    status: staff.isActive ? (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-500/20">
        Inactive
      </span>
    ),
    orphanageName: staff.orphanageName,
  }));

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <Breadcrumb items={['Management', 'Staff']} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400">
            <FiBriefcase className="h-5 w-5" />
          </div>
          <div>
            <h1 className="page-title">Staff Management</h1>
            <p className="page-subtitle">Manage orphanage staff members and their roles</p>
          </div>
        </div>
        <button
          onClick={handleAddStaff}
          className="flex items-center gap-2 rounded-lg bg-civic-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-civic-700 hover:shadow-md dark:bg-civic-500 dark:hover:bg-civic-600"
        >
          <FiPlus className="h-4 w-4" />
          Add Staff
        </button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {summaryConfig.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={classNames('flex items-center gap-3 rounded-xl px-4 py-3', s.color)}>
              <Icon className="h-4 w-4 shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{s.label}</p>
                <p className="mt-0.5 text-lg font-bold tabular-nums leading-none">{summary[s.key] || 0}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by name, email, or employee ID..."
          className="sm:max-w-md"
        />
        <StaffFilters filters={filters} onChange={handleFilterChange} onClear={handleClearFilters} />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="section-card"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader className="h-8 w-8 animate-spin text-civic-600" />
          </div>
        ) : data.length === 0 ? (
          <div className="empty-state py-16">
            <div className="empty-state-icon">
              <FiBriefcase className="h-6 w-6 text-slate-400" />
            </div>
            <p className="empty-state-title">No Staff Found</p>
            <p className="empty-state-desc">
              {query ? 'Try adjusting your search or filters' : 'No staff members registered yet'}
            </p>
          </div>
        ) : (
          <>
            <DataTable
              columns={[
                { key: 'employeeId', label: 'Employee ID' },
                { key: 'name', label: 'Name' },
                { key: 'role', label: 'Role' },
                { key: 'designation', label: 'Designation' },
                { key: 'joiningDate', label: 'Joining Date' },
                { key: 'status', label: 'Status' },
                ...(isAdmin ? [{ key: 'orphanageName', label: 'Orphanage' }] : []),
              ]}
              rows={tableData}
              onRowClick={handleRowClick}
            />
            {pagination.totalPages > 1 && (
              <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
                <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
