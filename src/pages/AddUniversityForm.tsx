import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import './AddUniversityForm.css';

const AddUniversityForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    location: '',
    country: '',
    accreditation: '',
    rating: '',
    tuitionFees: { undergraduate: '', postgraduate: '' },
    programs: [''],
    admissionRequirements: [''],
    scholarships: [''],
    description: '',
    campusLife: '',
    studentCount: '',
    establishedYear: '',
    facilities: [''],
    website: '',
    contactEmail: '',
    featured: false,
  });
  const [universities, setUniversities] = useState([]);
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: false,
    tuition: false,
    programs: false,
    admissionRequirements: false,
    scholarships: false,
    facilities: false,
    additional: false,
  });

  const baseUrl = 'https://unicorner-back.vercel.app/universities';

  // Fetch universities on mount
  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl);
      if (response.data.success) {
        setUniversities(response.data.data);
      } else {
        setMessage(response.data.message || 'Failed to fetch universities');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error fetching universities');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTuitionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      tuitionFees: { ...prev.tuitionFees, [name]: value },
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const url = editingUniversity ? `${baseUrl}/${editingUniversity._id}` : baseUrl;
    const method = editingUniversity ? 'put' : 'post';

    const universityData = {
      ...formData,
      rating: parseFloat(formData.rating) || 0, // Ensure rating is a number
      studentCount: parseInt(formData.studentCount) || 0, // Ensure studentCount is a number
      establishedYear: parseInt(formData.establishedYear) || 0, // Ensure establishedYear is a number
    };

    try {
      const response = await axios[method](url, universityData);
      if (response.data.success) {
        setMessage(response.data.message || (editingUniversity ? 'University updated!' : 'University added!'));
        fetchUniversities(); // Refresh the list
        resetForm();
      } else {
        setMessage(response.data.message || `Error ${editingUniversity ? 'updating' : 'adding'} university`);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || `Error ${editingUniversity ? 'updating' : 'adding'} university`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (university) => {
    setEditingUniversity(university);
    setFormData({
      name: university.name,
      logo: university.logo || '',
      location: university.location,
      country: university.country,
      accreditation: university.accreditation,
      rating: university.rating.toString(),
      tuitionFees: {
        undergraduate: university.tuitionFees?.undergraduate || '',
        postgraduate: university.tuitionFees?.postgraduate || '',
      },
      programs: university.programs.length ? university.programs : [''],
      admissionRequirements: university.admissionRequirements.length ? university.admissionRequirements : [''],
      scholarships: university.scholarships.length ? university.scholarships : [''],
      description: university.description,
      campusLife: university.campusLife,
      studentCount: university.studentCount.toString(),
      establishedYear: university.establishedYear.toString(),
      facilities: university.facilities.length ? university.facilities : [''],
      website: university.website,
      contactEmail: university.contactEmail,
      featured: university.featured || false,
    });
    setExpandedSections({
      basic: true,
      tuition: true,
      programs: true,
      admissionRequirements: true,
      scholarships: true,
      facilities: true,
      additional: true,
    }); // Expand all sections when editing
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this university?')) return;
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.delete(`${baseUrl}/${id}`);
      if (response.data.success) {
        setMessage(response.data.message || 'University deleted!');
        fetchUniversities(); // Refresh the list
      } else {
        setMessage(response.data.message || 'Error deleting university');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error deleting university');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingUniversity(null);
    setFormData({
      name: '',
      logo: '',
      location: '',
      country: '',
      accreditation: '',
      rating: '',
      tuitionFees: { undergraduate: '', postgraduate: '' },
      programs: [''],
      admissionRequirements: [''],
      scholarships: [''],
      description: '',
      campusLife: '',
      studentCount: '',
      establishedYear: '',
      facilities: [''],
      website: '',
      contactEmail: '',
      featured: false,
    });
    setExpandedSections({
      basic: false,
      tuition: false,
      programs: false,
      admissionRequirements: false,
      scholarships: false,
      facilities: false,
      additional: false,
    });
    setMessage('');
  };

  return (
    <div className="add-university-form container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">
        {editingUniversity ? 'Edit University' : 'Add a New University'}
      </h2>
      {message && (
        <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </p>
      )}

      {/* University Form */}
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
                  placeholder="e.g., Harvard University"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                Logo URL:
                <input
                  type="url"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  required
                  placeholder="https://..."
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Cambridge, MA"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                Country:
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  placeholder="e.g., USA"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                Accreditation:
                <input
                  type="text"
                  name="accreditation"
                  value={formData.accreditation}
                  onChange={handleChange}
                  required
                  placeholder="e.g., NECHE"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                Rating (0-5):
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="0-5"
                  className="w-full p-2 border rounded-md"
                />
              </label>
            </div>
          )}
        </section>

        {/* Tuition Fees Section */}
        <section className="border rounded-md bg-background shadow-sm mt-4">
          <h3 onClick={() => toggleSection('tuition')} className="section-header">
            Tuition Fees {expandedSections.tuition ? '▲' : '▼'}
          </h3>
          {expandedSections.tuition && (
            <div className="form-group p-4">
              <label>
                Undergraduate:
                <input
                  type="text"
                  name="undergraduate"
                  value={formData.tuitionFees.undergraduate}
                  onChange={handleTuitionChange}
                  placeholder="$30,000/year"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                Postgraduate:
                <input
                  type="text"
                  name="postgraduate"
                  value={formData.tuitionFees.postgraduate}
                  onChange={handleTuitionChange}
                  placeholder="$35,000/year"
                  className="w-full p-2 border rounded-md"
                />
              </label>
            </div>
          )}
        </section>

        {/* Array Fields Section */}
        {['programs', 'admissionRequirements', 'scholarships', 'facilities'].map((field) => (
          <section key={field} className="border rounded-md bg-background shadow-sm mt-4">
            <h3 onClick={() => toggleSection(field)} className="section-header">
              {field.charAt(0).toUpperCase() + field.slice(1)} {expandedSections[field] ? '▲' : '▼'}
            </h3>
            {expandedSections[field] && (
              <div className="form-group p-4">
                {formData[field].map((item, index) => (
                  <div key={index} className="array-item flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange(field, index, e.target.value)}
                      required
                      placeholder={`Enter ${field.slice(0, -1)} ${index + 1}`}
                      className="w-full p-2 border rounded-md"
                    />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeArrayItem(field, index)}
                      disabled={formData[field].length === 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-btn"
                  onClick={() => addArrayItem(field)}
                >
                  Add {field.slice(0, -1)}
                </button>
              </div>
            )}
          </section>
        ))}

        {/* Additional Info Section */}
        <section className="border rounded-md bg-background shadow-sm mt-4">
          <h3 onClick={() => toggleSection('additional')} className="section-header">
            Additional Information {expandedSections.additional ? '▲' : '▼'}
          </h3>
          {expandedSections.additional && (
            <div className="form-group p-4">
              <label>
                Description:
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Brief overview of the university"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                Campus Life:
                <textarea
                  name="campusLife"
                  value={formData.campusLife}
                  onChange={handleChange}
                  required
                  placeholder="Describe student life"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                Student Count:
                <input
                  type="number"
                  name="studentCount"
                  value={formData.studentCount}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g., 15000"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                Established Year:
                <input
                  type="number"
                  name="establishedYear"
                  value={formData.establishedYear}
                  onChange={handleChange}
                  required
                  min="1000"
                  max={new Date().getFullYear()}
                  placeholder="e.g., 1636"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                Website:
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  required
                  placeholder="https://university.edu"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                Contact Email:
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  placeholder="info@university.edu"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label className="flex items-center">
                Featured:
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="ml-2"
                />
              </label>
            </div>
          )}
        </section>

        <div className="flex space-x-2 mt-4">
          <Button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Saving...' : editingUniversity ? 'Update University' : 'Add University'}
          </Button>
          {editingUniversity && (
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

      {/* University List */}
      <div className="university-list border rounded-md p-4 bg-background shadow-sm">
        <h3 className="text-lg font-semibold mb-4">University List</h3>
        {loading ? (
          <p>Loading universities...</p>
        ) : universities.length === 0 ? (
          <p>No universities available yet.</p>
        ) : (
          <div className="space-y-4">
            {universities.map((university) => (
              <div
                key={university._id}
                className="university-item flex items-center justify-between p-4 border rounded-md bg-white"
              >
                <div className="university-content">
                  <h4 className="font-semibold">{university.name}</h4>
                  <p className="text-sm text-muted-foreground">{university.location}, {university.country}</p>
                  <p className="text-sm text-muted-foreground">Rating: {university.rating}/5</p>
                  {university.logo && (
                    <img
                      src={university.logo}
                      alt={`${university.name} logo`}
                      className="h-12 w-12 object-contain mt-2"
                    />
                  )}
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {university.website}
                  </a>
                </div>
                <div className="action-buttons flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(university)}
                    aria-label="Edit university"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(university._id)}
                    aria-label="Delete university"
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

export default AddUniversityForm;