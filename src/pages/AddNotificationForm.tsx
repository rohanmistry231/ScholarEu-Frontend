import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import { toast } from '@/components/ui/use-toast'; // Optional, adjust if not available
import './AddNotificationForm.css';

const AddNotificationForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    link: '',
  });
  const [notifications, setNotifications] = useState([]);
  const [editingNotification, setEditingNotification] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ notification: true });

  const baseUrl = 'https://unicorner-back.vercel.app/notification';

  // Toggle collapsible section
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Fetch all notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl);
      if (response.data.success) {
        setNotifications(response.data.data);
      } else {
        setMessage(response.data.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const url = editingNotification ? `${baseUrl}/${editingNotification._id}` : baseUrl;
    const method = editingNotification ? 'put' : 'post';

    try {
      const response = await axios[method](url, formData);
      if (response.data.success) {
        setMessage(
          editingNotification
            ? 'Notification updated successfully!'
            : 'Notification added successfully!'
        );
        fetchNotifications(); // Refresh the list
        resetForm();
      } else {
        setMessage(response.data.message || `Error ${editingNotification ? 'updating' : 'adding'} notification`);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || `Error ${editingNotification ? 'updating' : 'adding'} notification`);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = (notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      link: notification.link || '',
    });
    setExpandedSections({ notification: true }); // Expand form when editing
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.delete(`${baseUrl}/${id}`);
      if (response.data.success) {
        setMessage(response.data.message || 'Notification deleted successfully!');
        fetchNotifications(); // Refresh the list
      } else {
        setMessage(response.data.message || 'Error deleting notification');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error deleting notification');
    } finally {
      setLoading(false);
    }
  };

  // Reset form after submission or cancel
  const resetForm = () => {
    setEditingNotification(null);
    setFormData({
      title: '',
      message: '',
      link: '',
    });
    setMessage('');
  };

  return (
    <div className="add-notification-form container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">
        {editingNotification ? 'Edit Notification' : 'Add a New Notification'}
      </h2>
      {message && (
        <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </p>
      )}

      {/* Notification Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <section className="border rounded-md p-4 bg-background shadow-sm">
          <h3
            onClick={() => toggleSection('notification')}
            className="text-lg font-semibold cursor-pointer flex justify-between items-center"
          >
            Notification Details {expandedSections.notification ? '▲' : '▼'}
          </h3>
          {expandedSections.notification && (
            <div className="form-group space-y-4 mt-4">
              <label className="block">
                Title:
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., New Scholarship Available"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label className="block">
                Message:
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Check out this opportunity!"
                  className="w-full p-2 border rounded-md"
                />
              </label>
              <label className="block">
                Link (Optional):
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="e.g., https://example.com/scholarship"
                  className="w-full p-2 border rounded-md"
                />
              </label>
            </div>
          )}
        </section>

        <div className="flex space-x-2 mt-4">
          <Button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Saving...' : editingNotification ? 'Update Notification' : 'Add Notification'}
          </Button>
          {editingNotification && (
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

      {/* Notification List */}
      <div className="notification-list border rounded-md p-4 bg-background shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Notification List</h3>
        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p>No notifications available yet.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="flex items-center justify-between p-4 border rounded-md bg-white"
              >
                <div>
                  <h4 className="font-semibold">{notification.title}</h4>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  {notification.link && (
                    <a
                      href={notification.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {notification.link}
                    </a>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(notification)}
                    aria-label="Edit notification"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(notification._id)}
                    aria-label="Delete notification"
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

export default AddNotificationForm;