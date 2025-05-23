'use client';

import { useState } from 'react';

export default function FormPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('Form submitted successfully!');
        setFormData({ name: '', email: '', age: '', gender: '' });
      } else {
        setMessage('Submission failed. Try again.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error submitting form.');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Submit Your Details</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-3 border border-gray-300 rounded-xl"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-xl"
          required
        />
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          className="w-full p-3 border border-gray-300 rounded-xl"
          required
          min="0"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl"
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Submit
        </button>
        {message && <p className="text-center text-green-600">{message}</p>}
      </form>
    </div>
  );
}
