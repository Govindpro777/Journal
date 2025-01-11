import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, LogOut, Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { journalAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('Neutral');
  const [filter, setFilter] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [quote, setQuote] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await journalAPI.getEntries();
      setEntries(response.data);
    } catch (error) {
      toast.error('Failed to fetch entries');
    }
  };

  const fetchQuote = async () => {
    try {
      const response = await journalAPI.getQuote();
      setQuote(response.data.quote);
    } catch (error) {
      console.error('Failed to fetch quote:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await journalAPI.updateEntry(isEditing, { title, content, mood });
        toast.success('Entry updated successfully');
      } else {
        await journalAPI.createEntry({ title, content, mood });
        toast.success('Entry created successfully');
        fetchQuote();
      }
      setTitle('');
      setContent('');
      setMood('Neutral');
      setIsEditing(null);
      fetchEntries();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update entry' : 'Failed to create entry');
    }
  };

  const handleEdit = (entry) => {
    setIsEditing(entry._id);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood);
  };

  const handleDelete = async (id) => {
    try {
      await journalAPI.deleteEntry(id);
      toast.success('Entry deleted successfully');
      fetchEntries();
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.title.toLowerCase().includes(filter.toLowerCase()) ||
      entry.content.toLowerCase().includes(filter.toLowerCase());
    const matchesMood = !moodFilter || entry.mood === moodFilter;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Book className="w-8 h-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold">Mood Journal</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? 'Edit Entry' : 'New Entry'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mood</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="Happy">Happy</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Sad">Sad</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isEditing ? (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Update Entry
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Entry
                    </>
                  )}
                </button>
              </div>
            </form>

            {quote && (
              <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Daily Quote</h3>
                <p className="text-gray-600 italic">{quote}</p>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-semibold">Journal Entries</h2>
                <div className="mt-4 sm:mt-0 space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <select
                    value={moodFilter}
                    onChange={(e) => setMoodFilter(e.target.value)}
                    className="block w-full sm:w-auto mt-2 sm:mt-0 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">All Moods</option>
                    <option value="Happy">Happy</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Sad">Sad</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{entry.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </p>
                        <p className="mt-2">{entry.content}</p>
                        <span className={`inline-block mt-2 px-2 py-1 text-sm rounded-full ${
                          entry.mood === 'Happy'
                            ? 'bg-green-100 text-green-800'
                            : entry.mood === 'Sad'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.mood}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="text-gray-600 hover:text-indigo-600"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredEntries.length === 0 && (
                  <p className="text-center text-gray-500">No entries found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Journal;