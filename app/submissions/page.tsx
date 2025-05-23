'use client';

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/utils/api';

type Submission = {
  id: string;
  name: string;
  email: string;
  age: string;
  gender: string;
  comment?: string;
};

export default function SubmissionsPage() {
  const [data, setData] = useState<Submission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Partial<Submission>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/data`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const json = await res.json();
      setData(json.data);
      setError(null);
    } catch (err) {
      setError('Failed to load submissions.');
      console.error(err);
    }
  };

  const startEditing = (entry: Submission) => {
    setEditingId(entry.id);
    setFormValues(entry);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormValues({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/update/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });
      if (!res.ok) throw new Error('Failed to update entry');
      await fetchData();
      cancelEditing();
    } catch (err) {
      setError('Failed to update entry.');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/delete/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete entry');
      await fetchData();
    } catch (err) {
      setError('Failed to delete entry.');
      console.error(err);
    }
  };

  return (
    <section className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Submitted Feedbacks</h1>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="text-xs uppercase text-gray-600 tracking-wider">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Age</th>
              <th className="px-6 py-4">Gender</th>
              <th className="px-6 py-4">Comment</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">No submissions yet.</td>
              </tr>
            ) : (
              data.map(item => (
                <tr
                  key={item.id}
                  className="border-t border-gray-200 hover:bg-gray-50 even:bg-gray-50"
                >
                  {editingId === item.id ? (
                    <>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          name="name"
                          value={formValues.name || ''}
                          onChange={handleChange}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="email"
                          name="email"
                          value={formValues.email || ''}
                          onChange={handleChange}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          name="age"
                          value={formValues.age || ''}
                          onChange={handleChange}
                          min={0}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <select
                          name="gender"
                          value={formValues.gender || ''}
                          onChange={handleChange}
                          className="w-full border rounded px-2 py-1"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <textarea
                          name="comment"
                          value={formValues.comment || ''}
                          onChange={handleChange}
                          className="w-full border rounded px-2 py-1"
                          rows={2}
                        />
                      </td>
                      <td className="px-2 py-2 space-x-2">
                        <button
                          onClick={() => handleUpdate(item.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">{item.name}</td>
                      <td className="px-6 py-4">{item.email}</td>
                      <td className="px-6 py-4">{item.age}</td>
                      <td className="px-6 py-4 capitalize">{item.gender}</td>
                      <td className="px-6 py-4 whitespace-pre-wrap break-words">{item.comment || '-'}</td>
                      <td className="px-6 py-4 space-x-2">
                        <div className="flex gap-3 mt-4">
  <button
    onClick={() => startEditing(item)}
    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
  >
    Edit
  </button>
  <button
    onClick={() => handleDelete(item.id)}
    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
  >
    Delete
  </button>
</div>

                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {data.map(item => (
          <div key={item.id} className="border rounded-xl p-4 shadow">
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Email:</strong> {item.email}</p>
            <p><strong>Age:</strong> {item.age}</p>
            <p><strong>Gender:</strong> {item.gender}</p>
            <p className="whitespace-pre-wrap break-words"><strong>Comment:</strong> {item.comment || '-'}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => startEditing(item)}
                className="bg-blue-600 text-white p-4 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
