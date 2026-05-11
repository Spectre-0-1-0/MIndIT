import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function BFI10Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'identified', 'anonymous'
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState({ total: 0, identified: 0, anonymous: 0, today: 0 });
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a valid token
    if (token) {
      verifyToken();
    }
  }, []);

  useEffect(() => {
    if (authenticated && token) {
      loadSubmissions();
      loadStats();
    }
  }, [authenticated, token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setAuthenticated(true);
      } else {
        // Token invalid, clear it
        localStorage.removeItem('adminToken');
        setToken('');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('adminToken');
      setToken('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError('');

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        const newToken = data.token;
        setToken(newToken);
        localStorage.setItem('adminToken', newToken);
        setAuthenticated(true);
        setPassword('');
      } else {
        setPasswordError(data.error || 'Login failed');
        setPassword('');
      }
    } catch (error) {
      console.error('Login error:', error);
      setPasswordError('Network error. Please try again.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      const params = new URLSearchParams({
        type: filterType,
        search: searchTerm,
        limit: '1000'
      });

      const response = await fetch(`${API_BASE}/api/bfi10/submissions?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
        setFilteredSubmissions(data.submissions);
      } else {
        console.error('Failed to load submissions');
        if (response.status === 401) {
          handleLogout();
        }
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/bfi10/submissions/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const applyFilters = (records, search, type) => {
    // Since API handles filtering, just set the filtered submissions
    setFilteredSubmissions(records);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    // Reload with new search term
    loadSubmissions();
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
    // Reload with new filter
    loadSubmissions();
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setShowDetailsModal(true);
  };

  const handleDeleteSubmission = async (submission) => {
    if (window.confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_BASE}/api/bfi10/submissions/${submission.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          loadSubmissions();
          loadStats();
          setShowDetailsModal(false);
          setSelectedSubmission(null);
        } else {
          alert('Failed to delete submission');
        }
      } catch (error) {
        console.error('Error deleting submission:', error);
        alert('Network error. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setToken('');
    localStorage.removeItem('adminToken');
    setSubmissions([]);
    setFilteredSubmissions([]);
    setStats({ total: 0, identified: 0, anonymous: 0, today: 0 });
  };

  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) {
      alert('No submissions to export.');
      return;
    }

    const headers = [
      'Timestamp',
      'Type',
      'Name',
      'Roll Number',
      'Email',
      'Phone',
      'Department',
      'Academic Year',
      'Openness',
      'Conscientiousness',
      'Extraversion',
      'Agreeableness',
      'Neuroticism',
    ];

    const rows = filteredSubmissions.map((s) => [
      new Date(s.timestamp).toLocaleString(),
      s.anonymous ? 'Anonymous' : 'Identified',
      s.anonymous ? 'N/A' : s.userInfo.fullName,
      s.anonymous ? 'N/A' : s.userInfo.rollNumber,
      s.anonymous ? 'N/A' : s.userInfo.email,
      s.anonymous ? 'N/A' : s.userInfo.phone || 'N/A',
      s.anonymous ? 'N/A' : s.userInfo.department || 'N/A',
      s.anonymous ? 'N/A' : s.userInfo.academicYear || 'N/A',
      s.oceanScores.openness.toFixed(2),
      s.oceanScores.conscientiousness.toFixed(2),
      s.oceanScores.extraversion.toFixed(2),
      s.oceanScores.agreeableness.toFixed(2),
      s.oceanScores.neuroticism.toFixed(2),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
    element.setAttribute('download', `BFI10_Submissions_${new Date().getTime()}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // AUTHENTICATION SCREEN
  if (!authenticated) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-slate-50 to-white px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600">BFI-10 Assessment Submissions</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-900">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className={`w-full rounded-lg border px-4 py-2 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 ${
                  passwordError
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              {passwordError && (
                <p className="text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            Back to Home
          </button>
        </div>
      </section>
    );
  }

  // ADMIN DASHBOARD
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-700 p-8 text-white shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-indigo-100">BFI-10 Assessment Submissions</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full bg-white/20 hover:bg-white/30 px-4 py-2 text-sm font-semibold text-white transition"
        >
          Logout
        </button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Total Submissions</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Identified Submissions</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.identified}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Anonymous Submissions</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.anonymous}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Today's Submissions</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.today}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, roll number, or email..."
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Submissions</option>
            <option value="identified">Identified Only</option>
            <option value="anonymous">Anonymous Only</option>
          </select>

          {/* Export */}
          <button
            onClick={handleExportCSV}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            📥 Export to CSV
          </button>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="rounded-3xl bg-white shadow-sm overflow-hidden border border-slate-200">
        {filteredSubmissions.length === 0 ? (
          <div className="p-8 text-center text-slate-600">
            <p>No submissions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Timestamp</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Type</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Name / ID</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Email</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-900">OCEAN Scores</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission, index) => (
                  <tr key={index} className="border-b border-slate-200 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-slate-900">
                      {new Date(submission.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        submission.anonymous
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {submission.anonymous ? '🔒 Anonymous' : '👤 Identified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-900">
                      {submission.anonymous ? 'N/A' : (
                        <>
                          <div>{submission.userInfo.fullName}</div>
                          <div className="text-xs text-slate-500">{submission.userInfo.rollNumber}</div>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-900">
                      {submission.anonymous ? 'N/A' : submission.userInfo.email}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between gap-2">
                          <span>O:</span>
                          <span className="font-semibold">{submission.oceanScores.openness.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span>C:</span>
                          <span className="font-semibold">{submission.oceanScores.conscientiousness.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span>E:</span>
                          <span className="font-semibold">{submission.oceanScores.extraversion.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span>A:</span>
                          <span className="font-semibold">{submission.oceanScores.agreeableness.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span>N:</span>
                          <span className="font-semibold">{submission.oceanScores.neuroticism.toFixed(2)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleViewDetails(submission)}
                          className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-semibold hover:bg-indigo-200 transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteSubmission(submission)}
                          className="px-3 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedSubmission ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-xl max-h-screen overflow-y-auto space-y-6">
            <header className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Submission Details</h2>
              <p className="text-sm text-slate-600">
                {new Date(selectedSubmission.timestamp).toLocaleString()}
              </p>
            </header>

            {!selectedSubmission.anonymous && (
              <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-6 space-y-3">
                <h3 className="font-semibold text-slate-900">Personal Information</h3>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Name:</span>
                    <span className="font-medium text-slate-900">{selectedSubmission.userInfo.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Roll Number:</span>
                    <span className="font-medium text-slate-900">{selectedSubmission.userInfo.rollNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Email:</span>
                    <span className="font-medium text-slate-900">{selectedSubmission.userInfo.email}</span>
                  </div>
                  {selectedSubmission.userInfo.phone && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Phone:</span>
                      <span className="font-medium text-slate-900">{selectedSubmission.userInfo.phone}</span>
                    </div>
                  )}
                  {selectedSubmission.userInfo.department && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Department:</span>
                      <span className="font-medium text-slate-900">{selectedSubmission.userInfo.department}</span>
                    </div>
                  )}
                  {selectedSubmission.userInfo.academicYear && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Academic Year:</span>
                      <span className="font-medium text-slate-900">{selectedSubmission.userInfo.academicYear}</span>
                    </div>
                  )}
                </div>
                <div className="pt-3 border-t border-indigo-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <span className="text-lg">✅</span>
                    <span className="text-sm font-medium">Consent given for data collection and administrative tracking</span>
                  </div>
                </div>
              </div>
            )}

            {selectedSubmission.anonymous && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 space-y-3">
                <div className="flex items-center gap-2 text-amber-900">
                  <span className="text-lg">🔒</span>
                  <span className="font-semibold">Anonymous Submission</span>
                </div>
                <p className="text-sm text-amber-800">
                  No personal information was collected. Only survey responses have been stored for research purposes.
                </p>
                <div className="pt-3 border-t border-amber-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <span className="text-lg">✅</span>
                    <span className="text-sm font-medium">User confirmed understanding of anonymous data collection</span>
                  </div>
                </div>
              </div>
            )}

            {/* OCEAN Scores */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900">OCEAN Personality Scores</h3>
              <div className="grid gap-3">
                {Object.entries(selectedSubmission.oceanScores).map(([trait, score]) => (
                  <div key={trait} className="flex justify-between items-center rounded-lg bg-slate-50 p-3">
                    <span className="text-sm font-medium text-slate-900 capitalize">{trait}</span>
                    <div className="flex gap-3 items-center">
                      <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600"
                          style={{ width: `${(score / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-slate-900 w-12 text-right">{score.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Raw Responses */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900">Assessment Responses</h3>
              <div className="space-y-1 text-xs">
                {selectedSubmission.responses.map((response, idx) => (
                  <div key={idx} className="flex justify-between items-center rounded-lg bg-slate-50 p-2">
                    <span className="text-slate-600">Question {idx + 1}:</span>
                    <span className="font-medium text-slate-900">{response}/5</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowDetailsModal(false)}
              className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
