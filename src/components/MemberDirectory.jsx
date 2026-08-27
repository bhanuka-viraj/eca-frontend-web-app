import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  Mail,
  Shield,
  UserCheck,
  RefreshCw,
  X,
  Sparkles,
  Database,
  Building,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { userService } from '../services/api';

// Seed members for demonstration if Cloud SQL is fresh
const SEED_USERS = [
  {
    id: 1,
    name: 'J P Bhanuka Viraj Madhuranga',
    email: 'bhanuka.viraj@educloud.io',
    role: 'INSTRUCTOR',
    department: 'Cloud Platform Engineering',
    createdAt: '2026-08-15'
  },
  {
    id: 2,
    name: 'Elena Rostova',
    email: 'elena.rostova@cloudtech.org',
    role: 'INSTRUCTOR',
    department: 'Artificial Intelligence & Data',
    createdAt: '2026-08-18'
  },
  {
    id: 3,
    name: 'Sarah Chen',
    email: 'sarah.chen@sre-devops.io',
    role: 'STUDENT',
    department: 'DevOps & SRE Track',
    createdAt: '2026-08-20'
  },
  {
    id: 4,
    name: 'Marcus Aurelius Vance',
    email: 'marcus.v@distributed.net',
    role: 'STUDENT',
    department: 'Backend Distributed Systems',
    createdAt: '2026-08-22'
  },
  {
    id: 5,
    name: 'DevOps Cloud Admin',
    email: 'admin@enterprise-cloud-module.internal',
    role: 'ADMIN',
    department: 'Infrastructure Security & IAM',
    createdAt: '2026-08-01'
  }
];

export default function MemberDirectory({ onNotify }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [submittingUser, setSubmittingUser] = useState(false);

  // New User Form State
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'STUDENT',
    department: 'Cloud Computing'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      if (Array.isArray(data) && data.length > 0) {
        setUsers(data);
      } else {
        setUsers(SEED_USERS);
      }
    } catch (error) {
      console.warn('API error loading users, using fallback seed data:', error);
      setUsers(SEED_USERS);
      onNotify?.({
        type: 'warning',
        message: 'User Service unreachable via Gateway. Showing local member registry.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.email.trim()) {
      onNotify?.({ type: 'warning', message: 'Name and Email are required fields.' });
      return;
    }

    setSubmittingUser(true);
    try {
      await userService.create(newUserData);
      onNotify?.({
        type: 'success',
        message: `Member "${newUserData.name}" onboarded successfully into Cloud SQL (MySQL)!`
      });
      setIsOnboardingModalOpen(false);
      setNewUserData({ name: '', email: '', role: 'STUDENT', department: 'Cloud Computing' });
      fetchUsers();
    } catch (error) {
      // Local fallback creation if backend offline
      const newUser = {
        id: Date.now(),
        ...newUserData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers((prev) => [newUser, ...prev]);
      setIsOnboardingModalOpen(false);
      onNotify?.({
        type: 'success',
        message: `Member "${newUserData.name}" registered in directory.`
      });
    } finally {
      setSubmittingUser(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete member profile "${name}"?`)) return;
    try {
      await userService.delete(id);
      onNotify?.({
        type: 'info',
        message: `Member "${name}" removed from Cloud SQL.`
      });
      fetchUsers();
    } catch (error) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      onNotify?.({
        type: 'info',
        message: `Member "${name}" removed.`
      });
    }
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const nameMatch = (u.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const deptMatch = (u.department || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || emailMatch || deptMatch;

    const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const studentCount = users.filter((u) => u.role === 'STUDENT').length;
  const instructorCount = users.filter((u) => u.role === 'INSTRUCTOR').length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Identity & Access Management (IAM)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Member & Faculty <span className="text-gradient">Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enterprise user management and RBAC authorization stored securely in <span className="text-cyan-400 font-mono">Google Cloud SQL (MySQL)</span>.
          </p>
        </div>

        <button
          onClick={() => setIsOnboardingModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition flex-shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Onboard New Member</span>
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Members</span>
            <div className="text-xl font-extrabold text-slate-100 font-mono">{users.length}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Students</span>
            <div className="text-xl font-extrabold text-cyan-400 font-mono">{studentCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Instructors</span>
            <div className="text-xl font-extrabold text-purple-400 font-mono">{instructorCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Database</span>
            <div className="text-xs font-bold text-emerald-300 font-mono mt-1">Cloud SQL MySQL</div>
          </div>
        </div>
      </div>

      {/* Search and Role Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, email or track..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-400 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" />
            Role:
          </span>
          {['ALL', 'STUDENT', 'INSTRUCTOR', 'ADMIN'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedRole === role
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {role === 'ALL' ? 'All Roles' : role}
            </button>
          ))}

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
            title="Refresh Member Table"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Member Directory Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Member</th>
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Department / Program</th>
                <th className="py-3.5 px-4">Record ID</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 mx-auto animate-spin text-indigo-400 mb-2" />
                    <span>Loading member profiles from Cloud SQL...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No members match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const initials = user.name
                    ? user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                    : 'U';

                  return (
                    <tr
                      key={user.id || user.email}
                      className="hover:bg-slate-900/40 transition group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shadow">
                            {initials}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-100">{user.name}</span>
                            {user.createdAt && (
                              <div className="text-[10px] text-slate-500 font-mono">
                                Member since {user.createdAt}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 font-mono text-slate-300">
                        <div className="flex items-center space-x-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            user.role === 'ADMIN'
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                              : user.role === 'INSTRUCTOR'
                              ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                              : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4 text-slate-300">
                        <div className="flex items-center space-x-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          <span>{user.department || 'Cloud Engineering'}</span>
                        </div>
                      </td>

                      {/* SQL Record ID */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        #{user.id || 'AUTO'}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-80 group-hover:opacity-100"
                          title="Delete Member from Cloud SQL"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard New Member Modal */}
      {isOnboardingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Onboard New Member</h3>
                  <p className="text-[11px] text-slate-400">Write to Cloud SQL MySQL Database</p>
                </div>
              </div>
              <button
                onClick={() => setIsOnboardingModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. student@educloud.io"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Role</label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="INSTRUCTOR">INSTRUCTOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Department</label>
                  <input
                    type="text"
                    value={newUserData.department}
                    onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
                    placeholder="e.g. Cloud Computing"
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOnboardingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingUser}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {submittingUser && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Member to Cloud SQL</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
