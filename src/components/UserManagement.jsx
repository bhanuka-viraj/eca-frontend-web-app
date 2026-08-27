import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Database, Search, Trash2, Mail, Shield, UserCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { userService } from '../services/api';

export default function UserManagement({ onNotify }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'STUDENT'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading users:', error);
      onNotify?.({
        type: 'error',
        message: `Failed to fetch users: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      onNotify?.({ type: 'warning', message: 'Name and email are required.' });
      return;
    }

    setSubmitting(true);
    try {
      const created = await userService.create(formData);
      onNotify?.({
        type: 'success',
        message: `User '${formData.name}' created successfully in Cloud SQL!`
      });
      setFormData({ name: '', email: '', role: 'STUDENT' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      onNotify?.({
        type: 'error',
        message: `User creation failed: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) return;
    try {
      await userService.delete(id);
      onNotify?.({ type: 'info', message: `User "${name}" deleted.` });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      onNotify?.({
        type: 'error',
        message: `Delete failed: ${error.response?.data?.message || error.message}`
      });
    }
  };

  // Filtered list
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Statistics
  const studentCount = users.filter((u) => u.role === 'STUDENT').length;
  const instructorCount = users.filter((u) => u.role === 'INSTRUCTOR').length;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col h-full">
      {/* Service Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-100">1. User Service</h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Cloud SQL (MySQL)
              </span>
            </div>
            <p className="text-xs text-slate-400">Manage relational user profiles & IAM roles</p>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition disabled:opacity-50"
          title="Refresh User Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 text-center">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total</div>
          <div className="text-lg font-bold text-slate-100 font-mono">{users.length}</div>
        </div>
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 text-center">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Students</div>
          <div className="text-lg font-bold text-cyan-400 font-mono">{studentCount}</div>
        </div>
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 text-center">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Instructors</div>
          <div className="text-lg font-bold text-purple-400 font-mono">{instructorCount}</div>
        </div>
      </div>

      {/* Create User Form */}
      <form onSubmit={handleCreateUser} className="space-y-3 mb-5 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5 mb-1">
          <UserPlus className="w-3.5 h-3.5 text-blue-400" />
          <span>Register New User</span>
        </div>

        <div>
          <input
            type="text"
            name="name"
            placeholder="Full Name (e.g. Bhanuka Viraj)"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full bg-slate-950/70 border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email Address (e.g. student@educloud.com)"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full bg-slate-950/70 border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="flex gap-2">
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="flex-1 bg-slate-950/70 border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition"
          >
            <option value="STUDENT">STUDENT</option>
            <option value="INSTRUCTOR">INSTRUCTOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-500/20 transition disabled:opacity-50 flex items-center space-x-1.5"
          >
            {submitting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <UserPlus className="w-3.5 h-3.5" />
            )}
            <span>Register</span>
          </button>
        </div>
      </form>

      {/* Search & Filter */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="bg-slate-950/50 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Roles</option>
          <option value="STUDENT">Student</option>
          <option value="INSTRUCTOR">Instructor</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2 pr-1">
        {loading && users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mb-2 text-cyan-400" />
            <span>Loading user profiles from Cloud SQL...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs bg-slate-900/20 rounded-xl border border-slate-800/40">
            <Users className="w-6 h-6 mx-auto mb-1 opacity-40" />
            <span>No users found. Register a new user above!</span>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id || user.email}
              className="group p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between"
            >
              <div className="min-w-0 flex-1 mr-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {user.name}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${
                      user.role === 'ADMIN'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : user.role === 'INSTRUCTOR'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                  <Mail className="w-3 h-3 text-slate-500" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>

              {user.id && (
                <button
                  onClick={() => handleDeleteUser(user.id, user.name)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Delete User"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
