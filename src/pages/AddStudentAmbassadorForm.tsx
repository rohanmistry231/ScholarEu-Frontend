import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import './AddStudentAmbassadorForm.css';

const AddStudentAmbassadorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    universityId: '',
    program: '',
    year: '',
    profileImage: '',
    about: '',
    contactInfo: '',
  });
  const [studentAmbassadors, setStudentAmbassadors] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ basic: false, profile: false });

  const baseUrl = 'https://unicorner-back.vercel.app/students';

  // Fetch universities and student ambassadors on mount
  useEffect(() => {
    fetchUniversities();
    fetchStudentAmbassadors();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await axios.get('https://unicorner-back.vercel.app/universities');
      setUniversities(response.data.data);
    } catch (error) {
      console.error('Error fetching universities:', error);
      setMessage('Error fetching universities');
    }
  };

  const fetchStudentAmbassadors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl);
      if (response.data.success) {
        setStudentAmbassadors(response.data.data);
      } else {
        setMessage(response.data.message || 'Failed to fetch student ambassadors');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error fetching student ambassadors');
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

    const url = editingStudent ? `${baseUrl}/${editingStudent._id}` : baseUrl;
    const method = editingStudent ? 'put' : 'post';

    const studentData = {
      ...formData,
      year: parseInt(formData.year), // Ensure year is a number
    };

    try {
      const response = await axios[method](url, studentData);
      if (response.data.success) {
        setMessage(response.data.message || (editingStudent ? 'Student Ambassador updated!' : 'Student Ambassador added!'));
        fetchStudentAmbassadors(); // Refresh the list
        resetForm();
      } else {
        setMessage(response.data.message || `Error ${editingStudent ? 'updating' : 'adding'} student ambassador`);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || `Error ${editingStudent ? 'updating' : 'adding'} student ambassador`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      universityId: student.universityId,
      program: student.program,
      year: student.year.toString(),
      profileImage: student.profileImage || '',
      about: student.about,
      contactInfo: student.contactInfo,
    });
    setExpandedSections({ basic: true, profile: true }); // Expand both sections when editing
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student ambassador?')) return;
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.delete(`${baseUrl}/${id}`);
      if (response.data.success) {
        setMessage(response.data.message || 'Student Ambassador deleted!');
        fetchStudentAmbassadors(); // Refresh the list
      } else {
        setMessage(response.data.message || 'Error deleting student ambassador');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error deleting student ambassador');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      universityId: '',
      program: '',
      year: '',
      profileImage: '',
      about: '',
      contactInfo: '',
    });
    setExpandedSections({ basic: false, profile: false });
    setMessage('');
  };

  return (
    <div className="add-student-ambassador-form container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">
        {editingStudent ? 'Edit Student Ambassador' : 'Add a New Student Ambassador'}
      </h2>
      {message && (
        <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </p>
      )}

      {/* Student Ambassador Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        {/* Basic Info Section */}
        <section className="border rounded-md bg-background shadow-sm">
          <h3 onClick={() => toggleSection('basic')} className="section-header">
            Basic Information {expandedSections.basic ? '▲' : '▼'}
          </h3>
          {expandedSections.basic && (
            <div className="form-group p-4">
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., John Doe"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                University:
                <select
                  name="universityId"
                  value={formData.universityId}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select a University</option>
                  {universities.map((uni) => (
                    <option key={uni._id} value={uni._id}>
                      {uni.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Program:
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Computer Science"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                Year:
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  min="1"
                  max={new Date().getFullYear()}
                  placeholder={`1-${new Date().getFullYear()}`}
                  className="w-full p-2 border rounded-md"
                />
              </label>
            </div>
          )}
        </section>

        {/* Profile Section */}
        <section className="border rounded-md bg-background shadow-sm mt-4">
          <h3 onClick={() => toggleSection('profile')} className="section-header">
            Profile {expandedSections.profile ? '▲' : '▼'}
          </h3>
          {expandedSections.profile && (
            <div className="form-group p-4">
              <label>
                Profile Image URL:
                <input
                  type="url"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                About:
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  required
                  placeholder="Tell us about yourself"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                Contact Info:
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  required
                  placeholder="e.g., +1-123-456-7890"
                  className="w-full p-2 border rounded-md"
                />
              </label>
            </div>
          )}
        </section>

        <div className="flex space-x-2 mt-4">
          <Button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Saving...' : editingStudent ? 'Update Student Ambassador' : 'Add Student Ambassador'}
          </Button>
          {editingStudent && (
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

      {/* Student Ambassador List */}
      <div className="student-list border rounded-md p-4 bg-background shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Student Ambassador List</h3>
        {loading ? (
          <p>Loading student ambassadors...</p>
        ) : studentAmbassadors.length === 0 ? (
          <p>No student ambassadors available yet.</p>
        ) : (
          <div className="space-y-4">
            {studentAmbassadors.map((student) => (
              <div
                key={student._id}
                className="student-item flex items-center justify-between p-4 border rounded-md bg-white"
              >
                <div className="student-content">
                  <h4 className="font-semibold">{student.name} - {student.program}</h4>
                  <p className="text-sm text-muted-foreground">Year: {student.year}</p>
                  <p className="text-sm text-muted-foreground">{student.about}</p>
                  <p className="text-sm text-muted-foreground">Contact: {student.contactInfo}</p>
                  {student.profileImage && (
                    <img
                      src={student.profileImage}
                      alt={`${student.name}'s profile`}
                      className="h-12 w-12 object-cover rounded-full mt-2"
                    />
                  )}
                </div>
                <div className="action-buttons flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(student)}
                    aria-label="Edit student ambassador"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(student._id)}
                    aria-label="Delete student ambassador"
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

export default AddStudentAmbassadorForm;