import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch, FiChevronLeft, FiChevronRight, FiEdit2,
  FiTrash2, FiCheck, FiX, FiFilter, FiRefreshCw, FiDownload
} from 'react-icons/fi';
import Breadcrumb from '../components/Breadcrumb';
import { Role } from '../common/enums/role.enum';
import * as userService from '../services/userService';

const DEFAULT_PAGINATION = { page: 1, limit: 20, total: 0, totalPages: 0 };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ role: '', isActive: true });
  const [saving, setSaving] = useState(false);

  // Load users
  const loadUsers = async (page = 1, searchVal = searchQuery, roleVal = roleFilter, statusVal = statusFilter) => {
    setLoading(true);
    try {
      const result = await userService.getUsers({
        page,
        limit: 20,
        search: searchVal || undefined,
        role: roleVal || undefined,
        isActive: statusVal !== '' ? statusVal === 'active' : undefined,
      });

      const payload = result.data || result;
      setUsers(payload.data || []);
      setPagination(payload.pagination || DEFAULT_PAGINATION);
    } catch (error) {
      console.error('Failed to load users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadUsers();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    loadUsers(1, query, roleFilter, statusFilter);
  };

  // Handle role filter
  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    loadUsers(1, searchQuery, role, statusFilter);
  };

  // Handle status filter
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    loadUsers(1, searchQuery, roleFilter, status);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadUsers(newPage, searchQuery, roleFilter, statusFilter);
    }
  };

  // Open edit modal
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditData({ role: user.role, isActive: user.isActive });
    setShowEditModal(true);
  };

  // Save changes
  const handleSaveChanges = async () => {
    if (!selectedUser) return;
    setSaving(true);

    try {
      if (editData.role !== selectedUser.role) {
        await userService.updateRole(selectedUser.id, editData.role);
      }
      if (editData.isActive !== selectedUser.isActive) {
        await userService.updateStatus(selectedUser.id, editData.isActive);
      }

      // Reload users
      loadUsers(pagination.page, searchQuery, roleFilter, statusFilter);
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to save changes:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDeleteClick = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      return;
    }

    try {
      await userService.deleteUser(user.id);
      loadUsers(pagination.page, searchQuery, roleFilter, statusFilter);
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={['Admin', 'Users', 'Management']} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage system users, roles, and account status
              </p>
            </div>
            <button
              onClick={() => loadUsers(pagination.page, searchQuery, roleFilter, statusFilter)}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <FiRefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-civic-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => handleRoleFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-civic-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="PARENT">Parent</option>
                <option value="ORPHANAGE">Orphanage</option>
                <option value="SOCIAL_WORKER">Social Worker</option>
                <option value="GUEST">Guest</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-civic-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {/* Clear Filters */}
              {(roleFilter || statusFilter || searchQuery) && (
                <button
                  onClick={() => {
                    setRoleFilter('');
                    setStatusFilter('');
                    setSearchQuery('');
                    loadUsers(1, '', '', '');
                  }}
                  className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }}>
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-civic-600 dark:border-slate-700 dark:border-t-civic-400" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-500 dark:text-slate-400">No users found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{user.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-500/20 dark:text-blue-200">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.isActive ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200">
                              <FiCheck className="h-3 w-3" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-500/20 dark:text-slate-300">
                              <FiX className="h-3 w-3" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {formatDate(user.lastLoginAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick(user)}
                              className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Edit user"
                            >
                              <FiEdit2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(user)}
                              className="rounded-lg p-2 hover:bg-red-100 dark:hover:bg-red-500/20"
                              title="Delete user"
                            >
                              <FiTrash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/50">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="rounded-lg border border-slate-200 p-2 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      <FiChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="rounded-lg border border-slate-200 p-2 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      <FiChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Edit {selectedUser.firstName} {selectedUser.lastName}
            </h2>

            <div className="mt-6 space-y-4">
              {/* Role Select */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                <select
                  value={editData.role}
                  onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-civic-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="PARENT">Parent</option>
                  <option value="ORPHANAGE">Orphanage</option>
                  <option value="SOCIAL_WORKER">Social Worker</option>
                  <option value="GUEST">Guest</option>
                </select>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Account Status</label>
                <button
                  onClick={() => setEditData({ ...editData, isActive: !editData.isActive })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    editData.isActive
                      ? 'bg-emerald-600'
                      : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      editData.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {editData.isActive ? 'User can access the system' : 'User cannot access the system'}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                className="flex-1 rounded-lg bg-civic-600 px-4 py-2 font-medium text-white hover:bg-civic-700 disabled:opacity-50 dark:bg-civic-500 dark:hover:bg-civic-600"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
