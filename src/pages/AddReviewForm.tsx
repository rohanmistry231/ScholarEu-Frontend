import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import './AddReviewForm.css';

const AddReviewForm = () => {
  const [formData, setFormData] = useState({
    universityId: '',
    studentName: '',
    profileImage: '',
    rating: '',
    comment: '',
    program: '',
  });
  const [reviews, setReviews] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ basic: false, review: false });

  const baseUrl = 'https://unicorner-back.vercel.app/reviews';

  // Fetch universities and reviews on mount
  useEffect(() => {
    fetchUniversities();
    fetchReviews();
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

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl);
      if (response.data.success) {
        setReviews(response.data.data);
      } else {
        setMessage(response.data.message || 'Failed to fetch reviews');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error fetching reviews');
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

    const url = editingReview ? `${baseUrl}/${editingReview._id}` : baseUrl;
    const method = editingReview ? 'put' : 'post';

    const reviewData = {
      ...formData,
      rating: parseFloat(formData.rating), // Ensure rating is a number
    };

    try {
      const response = await axios[method](url, reviewData);
      if (response.data.success) {
        setMessage(response.data.message || (editingReview ? 'Review updated!' : 'Review added!'));
        fetchReviews(); // Refresh the list
        resetForm();
      } else {
        setMessage(response.data.message || `Error ${editingReview ? 'updating' : 'adding'} review`);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || `Error ${editingReview ? 'updating' : 'adding'} review`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      universityId: review.universityId,
      studentName: review.studentName,
      profileImage: review.profileImage || '',
      rating: review.rating.toString(),
      comment: review.comment,
      program: review.program,
    });
    setExpandedSections({ basic: true, review: true }); // Expand both sections when editing
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.delete(`${baseUrl}/${id}`);
      if (response.data.success) {
        setMessage(response.data.message || 'Review deleted!');
        fetchReviews(); // Refresh the list
      } else {
        setMessage(response.data.message || 'Error deleting review');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error deleting review');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingReview(null);
    setFormData({
      universityId: '',
      studentName: '',
      profileImage: '',
      rating: '',
      comment: '',
      program: '',
    });
    setExpandedSections({ basic: false, review: false });
    setMessage('');
  };

  return (
    <div className="add-review-form container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">
        {editingReview ? 'Edit Review' : 'Add a New Review'}
      </h2>
      {message && (
        <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </p>
      )}

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        {/* Basic Info Section */}
        <section className="border rounded-md bg-background shadow-sm">
          <h3 onClick={() => toggleSection('basic')} className="section-header">
            Basic Information {expandedSections.basic ? '▲' : '▼'}
          </h3>
          {expandedSections.basic && (
            <div className="form-group p-4">
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
                Student Name:
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Jane Doe"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                Program:
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Mechanical Engineering"
                  className="w-full p-2 border rounded-md"
                />
              </label>
            </div>
          )}
        </section>

        {/* Review Details Section */}
        <section className="border rounded-md bg-background shadow-sm mt-4">
          <h3 onClick={() => toggleSection('review')} className="section-header">
            Review Details {expandedSections.review ? '▲' : '▼'}
          </h3>
          {expandedSections.review && (
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
                  placeholder="e.g., 4.5"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label>
                Comment:
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  required
                  placeholder="Share your experience..."
                  className="w-full p-2 border rounded-md"
                />
              </label>
            </div>
          )}
        </section>

        <div className="flex space-x-2 mt-4">
          <Button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Saving...' : editingReview ? 'Update Review' : 'Add Review'}
          </Button>
          {editingReview && (
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

      {/* Review List */}
      <div className="review-list border rounded-md p-4 bg-background shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Review List</h3>
        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews available yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="review-item flex items-center justify-between p-4 border rounded-md bg-white"
              >
                <div className="review-content">
                  <h4 className="font-semibold">{review.studentName} - {review.program}</h4>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                  <p className="text-sm">Rating: {review.rating}/5</p>
                  {review.profileImage && (
                    <img
                      src={review.profileImage}
                      alt={`${review.studentName}'s profile`}
                      className="h-12 w-12 object-cover rounded-full mt-2"
                    />
                  )}
                </div>
                <div className="action-buttons flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(review)}
                    aria-label="Edit review"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(review._id)}
                    aria-label="Delete review"
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

export default AddReviewForm;