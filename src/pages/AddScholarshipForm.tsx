import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import './AddScholarshipForm.css';

const AddScholarshipForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    deadline: '',
    link: '',
  });
  const [scholarships, setScholarships] = useState([]);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ info: false });

  const baseUrl = 'https://unicorner-back.vercel.app/scholarship';

  // Fetch scholarships on mount
  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl);
      setScholarships(response.data); // No 'success' or 'data' wrapper
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error fetching scholarships');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const url = editingScholarship ? `${baseUrl}/${editingScholarship._id}` : baseUrl;
    const method = editingScholarship ? 'put' : 'post';

    try {
      const response = await axios[method](url, formData);
      setMessage(editingScholarship ? 'Scholarship updated successfully!' : 'Scholarship added successfully!');
      fetchScholarships(); // Refresh the list
      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || `Error ${editingScholarship ? 'updating' : 'adding'} scholarship`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (scholarship) => {
    setEditingScholarship(scholarship);
    setFormData({
      name: scholarship.name,
      amount: scholarship.amount,
      deadline: scholarship.deadline,
      link: scholarship.link,
    });
    setExpandedSections({ info: true }); // Expand section when editing
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scholarship?')) return;
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.delete(`${baseUrl}/${id}`);
      setMessage(response.data.message || 'Scholarship deleted successfully!');
      fetchScholarships(); // Refresh the list
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error deleting scholarship');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingScholarship(null);
    setFormData({
      name: '',
      amount: '',
      deadline: '',
      link: '',
    });
    setExpandedSections({ info: false });
    setMessage('');
  };

  return (
    <div className="add-scholarship-form container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">
        {editingScholarship ? 'Edit Scholarship' : 'Add a New Scholarship'}
      </h2>
      {message && (
        <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </p>
      )}

      {/* Scholarship Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <section className="border rounded-md bg-background shadow-sm">
          <h3 onClick={() => toggleSection('info')} className="section-header">
            Scholarship Information {expandedSections.info ? '▲' : '▼'}
          </h3>
          {expandedSections.info && (
            <div className="form-group p-4">
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Merit Scholarship"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                Amount:
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  placeholder="e.g., $10,000"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                Deadline:
                <input
                  type="text"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 2025-12-31"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                Application Link:
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  required
                  placeholder="https://scholarship.com/apply"
                  className="w-full p-2 border rounded-md"
                />
              </label>
            </div>
          )}
        </section>

        <div className="flex space-x-2 mt-4">
          <Button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Saving...' : editingScholarship ? 'Update Scholarship' : 'Add Scholarship'}
          </Button>
          {editingScholarship && (
            <Button
              variant="outline"
              onClick={resetForm}
              disabled={loading}
              className="cancel-btn"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Scholarship List */}
      <div className="scholarship-list border rounded-md p-4 bg-background shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Scholarship List</h3>
        {loading ? (
          <p>Loading scholarships...</p>
        ) : scholarships.length === 0 ? (
          <p>No scholarships available yet.</p>
        ) : (
          <div className="space-y-4">
            {scholarships.map((scholarship) => (
              <div
                key={scholarship._id}
                className="scholarship-item flex items-center justify-between p-4 border rounded-md bg-white"
              >
                <div className="scholarship-content">
                  <h4 className="font-semibold">{scholarship.name}</h4>
                  <p className="text-sm text-muted-foreground">Amount: {scholarship.amount}</p>
                  <p className="text-sm text-muted-foreground">Deadline: {scholarship.deadline}</p>
                  <a
                    href={scholarship.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {scholarship.link}
                  </a>
                </div>
                <div className="action-buttons flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(scholarship)}
                    aria-label="Edit scholarship"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(scholarship._id)}
                    aria-label="Delete scholarship"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddScholarshipForm;