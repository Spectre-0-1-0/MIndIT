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
        setSubmissions(data.submissions || []);
        setFilteredSubmissions(data.submissions || []);
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

  const handleSearch = (value) => {
    setSearchTerm(value);
    loadSubmissions();
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
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
    localStorage.removeItem('bfi10AdminEntry');
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
      s.anonymous ? 'N/A' : s.userInfo?.fullName || 'N/A',
      s.anonymous ? 'N/A' : s.userInfo?.rollNumber || 'N/A',
      s.anonymous ? 'N/A' : s.userInfo?.email || 'N/A',
      s.anonymous ? 'N/A' : s.userInfo?.phone || 'N/A',
      s.anonymous ? 'N/A' : s.userInfo?.department || 'N/A',
      s.anonymous ? 'N/A' : s.userInfo?.academicYear || 'N/A',
      s.oceanScores?.openness?.toFixed(2) || '0.00',
      s.oceanScores?.conscientiousness?.toFixed(2) || '0.00',
      s.oceanScores?.extraversion?.toFixed(2) || '0.00',
      s.oceanScores?.agreeableness?.toFixed(2) || '0.00',
      s.oceanScores?.neuroticism?.toFixed(2) || '0.00',
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
              <label className="block text-sm font-medium text-slate-900">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className={`w-full rounded-lg border px-4 py-2 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 ${
                  passwordError ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
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

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">BFI-10 Administration Dashboard</h1>
          <p className="text-slate-500">Manage and analyze personality assessment data</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="px-5 py-2.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold hover:bg-emerald-100 transition flex items-center gap-2"
          >
            📥 Export CSV
          </button>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Responses', value: stats.total, color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Identified', value: stats.identified, color: 'bg-blue-50 text-blue-700' },
          { label: 'Anonymous', value: stats.anonymous, color: 'bg-amber-50 text-amber-700' },
          { label: 'Submitted Today', value: stats.today, color: 'bg-emerald-50 text-emerald-700' },
        ].map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-3xl ${stat.color} border border-current/10`}>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">{stat.label}</p>
            <p className="text-3xl font-black mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by name, roll number, or email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>
        <div className="flex gap-2">
          {['all', 'identified', 'anonymous'].map((type) => (
            <button
              key={type}
              onClick={() => handleFilterChange(type)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition ${
                filterType === type ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <div className="text-4xl">📊</div>
            <p className="text-slate-500 font-medium">No submissions found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">OCEAN Traits</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(submission.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        submission.anonymous ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {submission.anonymous ? '🔒 Anonymous' : '👤 Identified'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {submission.anonymous ? (
                        <span className="text-slate-400 italic text-sm">Not collected</span>
                      ) : (
                        <div>
                          <p className="text-sm font-bold text-slate-900">{submission.userInfo?.fullName || 'Unknown'}</p>
                          <p className="text-xs text-slate-500">{submission.userInfo?.rollNumber}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {submission.anonymous ? '-' : submission.userInfo?.email || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {['O', 'C', 'E', 'A', 'N'].map((trait) => {
                          const traitKey = { O: 'openness', C: 'conscientiousness', E: 'extraversion', A: 'agreeableness', N: 'neuroticism' }[trait];
                          const score = submission.oceanScores?.[traitKey] || 0;
                          return (
                            <div key={trait} className="flex flex-col items-center min-w-[32px] p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                              <span className="text-[10px] font-black text-slate-400 leading-none">{trait}</span>
                              <span className="text-xs font-bold text-slate-700 mt-1 leading-none">{score.toFixed(1)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleViewDetails(submission)}
                          className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleDeleteSubmission(submission)}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
                          title="Delete Submission"
                        >
                          🗑️
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
      {showDetailsModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-[2.5rem] bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <header className="flex items-start justify-between border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Submission Details</h2>
                <p className="text-slate-500 font-medium">Record ID: #{selectedSubmission.id} • {new Date(selectedSubmission.timestamp).toLocaleString()}</p>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-2xl p-2 hover:bg-slate-50 rounded-full transition">✕</button>
            </header>

            {!selectedSubmission.anonymous ? (
              <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600">Personal Information</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  {[
                    { label: 'Full Name', value: selectedSubmission.userInfo?.fullName },
                    { label: 'Roll Number', value: selectedSubmission.userInfo?.rollNumber },
                    { label: 'Email', value: selectedSubmission.userInfo?.email },
                    { label: 'Phone', value: selectedSubmission.userInfo?.phone },
                    { label: 'Department', value: selectedSubmission.userInfo?.department },
                    { label: 'Academic Year', value: selectedSubmission.userInfo?.academicYear },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase">{item.label}</p>
                      <p className="font-bold text-slate-900 break-all">{item.value || '-'}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-center gap-4">
                <div className="text-3xl">🔒</div>
                <div>
                  <p className="font-black text-amber-800">Anonymous Submission</p>
                  <p className="text-sm text-amber-700/80 font-medium">No personal identifiers were collected for this response.</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 px-1">Personality Profile</h3>
              <div className="grid gap-3">
                {['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'].map((trait) => {
                  const score = selectedSubmission.oceanScores?.[trait] || 0;
                  const interpretation = selectedSubmission.interpretation?.[trait] || {};
                  return (
                    <div key={trait} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-black text-slate-900 capitalize">{trait}</p>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500 uppercase">{interpretation.level || 'Moderate'}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{interpretation.description}</p>
                      </div>
                      <div className="flex items-center gap-4 ml-8">
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden hidden sm:block">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(score / 5) * 100}%` }} />
                        </div>
                        <p className="font-black text-indigo-600 w-8 text-right text-lg">{score.toFixed(1)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 px-1">Raw Responses</h3>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {(selectedSubmission.responses || []).map((resp, idx) => (
                  <div key={idx} className="flex flex-col items-center bg-slate-50 border border-slate-100 rounded-xl p-2">
                    <span className="text-[8px] font-black text-slate-400 leading-none">Q{idx + 1}</span>
                    <span className="text-sm font-black text-slate-700 mt-1">{resp}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowDetailsModal(false)}
              className="w-full py-4 rounded-full bg-slate-900 text-white font-black hover:bg-slate-800 transition shadow-lg"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
