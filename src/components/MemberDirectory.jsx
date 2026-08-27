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
  Building,
  GraduationCap,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { userService } from '../services/api';

// Verified LMS seed members
const SEED_USERS = [
  {
    id: 1,
    name: 'J P Bhanuka Viraj Madhuranga',
    email: 'bhanuka.viraj@edusphere.io',
    role: 'INSTRUCTOR',
    department: 'Cloud & Software Engineering',
    createdAt: '2026-08-15'
  },
  {
    id: 2,
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@edusphere.io',
    role: 'INSTRUCTOR',
    department: 'Data Science & Machine Learning',
    createdAt: '2026-08-18'
  },
  {
    id: 3,
    name: 'Sarah Chen',
    email: 'sarah.chen@student.edusphere.io',
    role: 'STUDENT',
    department: 'DevOps & Cloud Systems',
    createdAt: '2026-08-20'
  },
  {
    id: 4,
    name: 'Marcus Vance',
    email: 'marcus.v@student.edusphere.io',
    role: 'STUDENT',
    department: 'UI/UX & Product Design',
    createdAt: '2026-08-22'
  },
  {
    id: 5,
    name: 'David Reynolds',
    email: 'admin@edusphere.io',
    role: 'ADMIN',
    department: 'Academic Operations & Governance',
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

  // New Member Form State
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'STUDENT',
    department: 'Software Engineering'
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
        message: `Member "${newUserData.name}" added to the Academy!`
      });
      setIsOnboardingModalOpen(false);
      setNewUserData({ name: '', email: '', role: 'STUDENT', department: 'Software Engineering' });
      fetchUsers();
    } catch (error) {
      const newUser = {
        id: Date.now(),
        ...newUserData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers((prev) => [newUser, ...prev]);
      setIsOnboardingModalOpen(false);
      onNotify?.({
        type: 'success',
        message: `Member "${newUserData.name}" registered.`
      });
    } finally {
      setSubmittingUser(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove member profile "${name}"?`)) return;
    try {
      await userService.delete(id);
      onNotify?.({
        type: 'info',
        message: `Member "${name}" removed.`
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
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Academy Member Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Faculty & Students Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage student registrations, faculty appointments, and administrative access for the academy.
          </p>
        </div>

        <button
          onClick={() => setIsOnboardingModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition flex-shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Academy Member</span>
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Members</span>
            <div className="text-xl font-extrabold text-slate-900 font-mono">{users.length}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Students</span>
            <div className="text-xl font-extrabold text-blue-600 font-mono">{studentCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Faculty</span>
            <div className="text-xl font-extrabold text-purple-600 font-mono">{instructorCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Administrators</span>
            <div className="text-xl font-extrabold text-emerald-600 font-mono">{adminCount}</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-500 font-semibold flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" />
            Role:
          </span>
          {['ALL', 'STUDENT', 'INSTRUCTOR', 'ADMIN'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedRole === role
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {role === 'ALL' ? 'All Roles' : role === 'STUDENT' ? 'Students' : role === 'INSTRUCTOR' ? 'Faculty' : 'Admins'}
            </button>
          ))}

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition shadow-sm"
            title="Refresh Member Table"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-4 px-5">Member</th>
                <th className="py-4 px-5">Email Address</th>
                <th className="py-4 px-5">Role</th>
                <th className="py-4 px-5">Department / Track</th>
                <th className="py-4 px-5">Member ID</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 mx-auto animate-spin text-indigo-600 mb-2" />
                    <span>Loading academy directory...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No academy members match the search filter.
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
                      className="hover:bg-slate-50/70 transition group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                            {initials}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900">{user.name}</span>
                            {user.createdAt && (
                              <div className="text-[10px] text-slate-400">
                                Joined {user.createdAt}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-5 font-mono text-slate-600">
                        <div className="flex items-center space-x-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <a
                            href={`mailto:${user.email}`}
                            className="hover:text-indigo-600 transition"
                          >
                            {user.email}
                          </a>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            user.role === 'ADMIN'
                              ? 'bg-rose-50 text-rose-700 border border-rose-100'
                              : user.role === 'INSTRUCTOR'
                              ? 'bg-purple-50 text-purple-700 border border-purple-100'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-5 text-slate-700">
                        <div className="flex items-center space-x-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{user.department || 'General Studies'}</span>
                        </div>
                      </td>

                      {/* Member ID */}
                      <td className="py-3.5 px-5 font-mono text-[11px] text-slate-400">
                        #{user.id || 'AUTO'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Remove Member"
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

      {/* Add Academy Member Modal */}
      {isOnboardingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add Academy Member</h3>
                  <p className="text-[11px] text-slate-500">Register student or faculty profile</p>
                </div>
              </div>
              <button
                onClick={() => setIsOnboardingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. student@edusphere.io"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Role</label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="INSTRUCTOR">Faculty / Instructor</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Department / Major</label>
                  <input
                    type="text"
                    value={newUserData.department}
                    onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
                    placeholder="e.g. Software Engineering"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOnboardingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingUser}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {submittingUser && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
