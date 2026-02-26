import React, { useEffect, useState } from 'react';
import axios from '../axios';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

const emptyForm = {
  complainant_id: '',
  respondent_id: '',
  incident_date: '',
  incident_details: '',
  status: 'active',
};

const statusOptions = ['active', 'resolved', 'dismissed', 'forwarded'];

const extractErrorMessage = (error, fallbackMessage) => {
  const errors = error?.response?.data?.errors;
  if (errors) {
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey && Array.isArray(errors[firstErrorKey]) && errors[firstErrorKey].length > 0) {
      return errors[firstErrorKey][0];
    }
  }

  return error?.response?.data?.message || fallbackMessage;
};

const toDateTimeLocal = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

const fullName = (person) => {
  if (!person) {
    return 'N/A';
  }

  return [person.first_name, person.middle_name, person.last_name]
    .filter(Boolean)
    .join(' ');
};

const Blotter = () => {
  const [blotters, setBlotters] = useState([]);
  const [constituents, setConstituents] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
  });
  const [sort, setSort] = useState({ column: 'incident_date', direction: 'desc' });
  const [filter, setFilter] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const [editFormData, setEditFormData] = useState({ id: null, ...emptyForm });

  const fetchBlotters = async () => {
    try {
      const response = await axios.get('/blotters', {
        params: {
          page: pagination.currentPage,
          per_page: pagination.perPage,
          sort: `${sort.column}|${sort.direction}`,
          filter,
        },
      });

      setBlotters(response.data.data ?? []);
      setPagination((prev) => ({
        ...prev,
        currentPage: response.data.current_page ?? 1,
        totalPages: response.data.last_page ?? 1,
        perPage: response.data.per_page ?? prev.perPage,
      }));
    } catch (error) {
      console.error('Failed to fetch blotters', error);
      toast.error('Failed to load blotter records.');
    }
  };

  const fetchConstituents = async () => {
    try {
      const response = await axios.get('/constituents', {
        params: {
          per_page: -1,
          sort: 'first_name|asc',
        },
      });

      setConstituents(response.data ?? []);
    } catch (error) {
      console.error('Failed to fetch constituents', error);
      toast.error('Failed to load constituents list.');
    }
  };

  useEffect(() => {
    fetchConstituents();
  }, []);

  useEffect(() => {
    fetchBlotters();
  }, [pagination.currentPage, pagination.perPage, sort, filter]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (String(formData.complainant_id) === String(formData.respondent_id)) {
      toast.error('Complainant and respondent must be different persons.');
      return;
    }

    try {
      await axios.post('/blotters', formData);
      setFormData(emptyForm);
      document.getElementById('add_blotter_modal').close();
      toast.success('Blotter record added successfully!');
      fetchBlotters();
    } catch (error) {
      console.error('Failed to create blotter', error);
      toast.error(extractErrorMessage(error, 'Failed to add blotter record.'));
    }
  };

  const handleEdit = (blotter) => {
    setEditFormData({
      id: blotter.id,
      complainant_id: String(blotter.complainant_id),
      respondent_id: String(blotter.respondent_id),
      incident_date: toDateTimeLocal(blotter.incident_date),
      incident_details: blotter.incident_details,
      status: blotter.status,
    });

    document.getElementById('edit_blotter_modal').showModal();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (String(editFormData.complainant_id) === String(editFormData.respondent_id)) {
      toast.error('Complainant and respondent must be different persons.');
      return;
    }

    try {
      await axios.put(`/blotters/${editFormData.id}`, {
        complainant_id: editFormData.complainant_id,
        respondent_id: editFormData.respondent_id,
        incident_date: editFormData.incident_date,
        incident_details: editFormData.incident_details,
        status: editFormData.status,
      });

      document.getElementById('edit_blotter_modal').close();
      toast.success('Blotter record updated successfully!');
      fetchBlotters();
    } catch (error) {
      console.error('Failed to update blotter', error);
      toast.error(extractErrorMessage(error, 'Failed to update blotter record.'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blotter record?')) {
      return;
    }

    try {
      await axios.delete(`/blotters/${id}`);
      toast.success('Blotter record deleted successfully!');

      if (blotters.length === 1 && pagination.currentPage > 1) {
        setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
      } else {
        fetchBlotters();
      }
    } catch (error) {
      console.error('Failed to delete blotter', error);
      toast.error('Failed to delete blotter record.');
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold">Blotter</h1>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Filter by parties, status, or details..."
          className="input input-bordered w-full md:max-w-md"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
          }}
        />
        <button className="btn btn-primary" onClick={() => document.getElementById('add_blotter_modal').showModal()}>
          Add Blotter
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => setSort({ column: 'id', direction: sort.direction === 'asc' ? 'desc' : 'asc' })}>ID</th>
              <th>Complainant</th>
              <th>Respondent</th>
              <th onClick={() => setSort({ column: 'incident_date', direction: sort.direction === 'asc' ? 'desc' : 'asc' })}>Incident Date</th>
              <th onClick={() => setSort({ column: 'status', direction: sort.direction === 'asc' ? 'desc' : 'asc' })}>Status</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blotters.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">No blotter records found.</td>
              </tr>
            )}
            {blotters.map((blotter) => (
              <tr key={blotter.id}>
                <th>{blotter.id}</th>
                <td>{fullName(blotter.complainant)}</td>
                <td>{fullName(blotter.respondent)}</td>
                <td>{new Date(blotter.incident_date).toLocaleString()}</td>
                <td>
                  <span className="badge badge-outline capitalize">{blotter.status}</span>
                </td>
                <td className="max-w-md truncate" title={blotter.incident_details}>{blotter.incident_details}</td>
                <td>
                  <button className="btn btn-sm btn-warning mr-2" onClick={() => handleEdit(blotter)}>Edit</button>
                  <button className="btn btn-sm btn-error" onClick={() => handleDelete(blotter.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="join mt-4">
        <button
          className="join-item btn"
          onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))}
          disabled={pagination.currentPage === 1}
        >
          «
        </button>
        <button className="join-item btn">Page {pagination.currentPage}</button>
        <button
          className="join-item btn"
          onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          »
        </button>
      </div>

      <dialog id="add_blotter_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg">Add Blotter Record</h3>
          <form className="space-y-4 pt-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Complainant</span>
                </label>
                <select className="select select-bordered" name="complainant_id" value={formData.complainant_id} onChange={handleFormChange} required>
                  <option value="">Select complainant</option>
                  {constituents.map((constituent) => (
                    <option
                      key={constituent.id}
                      value={constituent.id}
                      disabled={String(formData.complainant_id) === String(constituent.id)}
                    >
                      {fullName(constituent)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Respondent</span>
                </label>
                <select className="select select-bordered" name="respondent_id" value={formData.respondent_id} onChange={handleFormChange} required>
                  <option value="">Select respondent</option>
                  {constituents.map((constituent) => (
                    <option
                      key={constituent.id}
                      value={constituent.id}
                      disabled={String(formData.respondent_id) === String(constituent.id)}
                    >
                      {fullName(constituent)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Incident Date and Time</span>
                </label>
                <input type="datetime-local" className="input input-bordered" name="incident_date" value={formData.incident_date} onChange={handleFormChange} required />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Incident Details</span>
                </label>
                <textarea className="textarea textarea-bordered" name="incident_details" value={formData.incident_details} onChange={handleFormChange} rows="4" required />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select className="select select-bordered" name="status" value={formData.status} onChange={handleFormChange} required>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Submit</button>
              <button type="button" className="btn" onClick={() => document.getElementById('add_blotter_modal').close()}>Close</button>
            </div>
          </form>
        </div>
      </dialog>

      <dialog id="edit_blotter_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg">Edit Blotter Record</h3>
          <form className="space-y-4 pt-4" onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Complainant</span>
                </label>
                <select className="select select-bordered" name="complainant_id" value={editFormData.complainant_id} onChange={handleEditFormChange} required>
                  <option value="">Select complainant</option>
                  {constituents.map((constituent) => (
                    <option
                      key={constituent.id}
                      value={constituent.id}
                      disabled={String(editFormData.complainant_id) === String(constituent.id)}
                    >
                      {fullName(constituent)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Respondent</span>
                </label>
                <select className="select select-bordered" name="respondent_id" value={editFormData.respondent_id} onChange={handleEditFormChange} required>
                  <option value="">Select respondent</option>
                  {constituents.map((constituent) => (
                    <option
                      key={constituent.id}
                      value={constituent.id}
                      disabled={String(editFormData.respondent_id) === String(constituent.id)}
                    >
                      {fullName(constituent)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Incident Date and Time</span>
                </label>
                <input type="datetime-local" className="input input-bordered" name="incident_date" value={editFormData.incident_date} onChange={handleEditFormChange} required />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Incident Details</span>
                </label>
                <textarea className="textarea textarea-bordered" name="incident_details" value={editFormData.incident_details} onChange={handleEditFormChange} rows="4" required />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select className="select select-bordered" name="status" value={editFormData.status} onChange={handleEditFormChange} required>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Update</button>
              <button type="button" className="btn" onClick={() => document.getElementById('edit_blotter_modal').close()}>Close</button>
            </div>
          </form>
        </div>
      </dialog>
    </Layout>
  );
};

export default Blotter;
