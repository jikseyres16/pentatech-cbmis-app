import React, { useState, useEffect } from 'react';
import axios from '../axios';
import Papa from 'papaparse';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

const Constituents = () => {
  const [constituents, setConstituents] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
  });
  const [sort, setSort] = useState({ column: 'id', direction: 'asc' });
  const [filter, setFilter] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: '',
    place_of_birth: '',
    gender: '',
    civil_status: '',
    address: '',
    contact_number: '',
    email: '',
  });
  const [editFormData, setEditFormData] = useState({
    id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: '',
    place_of_birth: '',
    gender: '',
    civil_status: '',
    address: '',
    contact_number: '',
    email: '',
  });

  useEffect(() => {
    const fetchConstituents = async () => {
      try {
        const response = await axios.get('/api/constituents', {
          params: {
            page: pagination.currentPage,
            per_page: pagination.perPage,
            sort: `${sort.column}|${sort.direction}`,
            filter: filter,
          },
        });
        setConstituents(response.data.data);
        setPagination({
          currentPage: response.data.current_page,
          totalPages: response.data.last_page,
          perPage: response.data.per_page,
        });
      } catch (error) {
        console.error('Failed to fetch constituents', error);
      }
    };

    fetchConstituents();
  }, [pagination.currentPage, pagination.perPage, sort, filter]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/constituents', formData);
      setConstituents([...constituents, response.data]);
      setFormData({
        first_name: '',
        middle_name: '',
        last_name: '',
        date_of_birth: '',
        place_of_birth: '',
        gender: '',
        civil_status: '',
        address: '',
        contact_number: '',
        email: '',
      });
      document.getElementById('my_modal_1').close();
      toast.success('Constituent added successfully!');
    } catch (error) {
      console.error('Failed to create constituent', error);
      toast.error('Failed to add constituent.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this constituent?')) {
      try {
        await axios.delete(`/api/constituents/${id}`);
        setConstituents(constituents.filter((constituent) => constituent.id !== id));
        toast.success('Constituent deleted successfully!');
      } catch (error) {
        console.error('Failed to delete constituent', error);
        toast.error('Failed to delete constituent.');
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('/api/constituents', {
        params: {
          per_page: -1, // Fetch all records
          filter: filter,
        },
      });
      const csv = Papa.unparse(response.data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'constituents.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export constituents', error);
    }
  };

  const handleEdit = (constituent) => {
    setEditFormData(constituent);
    document.getElementById('edit_modal').showModal();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/constituents/${editFormData.id}`, editFormData);
      setConstituents(constituents.map((constituent) => (constituent.id === editFormData.id ? response.data : constituent)));
      document.getElementById('edit_modal').close();
      toast.success('Constituent updated successfully!');
    } catch (error) {
      console.error('Failed to update constituent', error);
      toast.error('Failed to update constituent.');
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold">Constituents</h1>
      <div className="text-right">
        <button className="btn btn-primary" onClick={() => document.getElementById('my_modal_1').showModal()}>Add Constituent</button>
      </div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Constituent</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Middle Name</span>
                </label>
                <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} placeholder="Middle Name" className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Date of Birth</span>
                </label>
                <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Place of Birth</span>
                </label>
                <input type="text" name="place_of_birth" value={formData.place_of_birth} onChange={handleChange} placeholder="Place of Birth" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Gender</span>
                </label>
                <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Civil Status</span>
                </label>
                <input type="text" name="civil_status" value={formData.civil_status} onChange={handleChange} placeholder="Civil Status" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Contact Number</span>
                </label>
                <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="Contact Number" className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input input-bordered" />
              </div>
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Submit</button>
              <button type="button" className="btn" onClick={() => document.getElementById('my_modal_1').close()}>Close</button>
            </div>
          </form>
        </div>
      </dialog>
      <div className="flex justify-between my-4">
        <input type="text" placeholder="Filter by name..." className="input input-bordered" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <button className="btn btn-accent" onClick={handleExport}>Export</button>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th onClick={() => setSort({ column: 'id', direction: sort.direction === 'asc' ? 'desc' : 'asc' })}>ID</th>
              <th onClick={() => setSort({ column: 'first_name', direction: sort.direction === 'asc' ? 'desc' : 'asc' })}>Name</th>
              <th>Address</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {constituents.map((constituent) => (
              <tr key={constituent.id}>
                <th>{constituent.id}</th>
                <td>{constituent.first_name} {constituent.last_name}</td>
                <td>{constituent.address}</td>
                <td>{constituent.email}</td>
                <td>
                  <button className="btn btn-sm btn-warning mr-2" onClick={() => handleEdit(constituent)}>Edit</button>
                  <button className="btn btn-sm btn-error" onClick={() => handleDelete(constituent.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="join mt-4">
        <button className="join-item btn" onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })} disabled={pagination.currentPage === 1}>«</button>
        <button className="join-item btn">Page {pagination.currentPage}</button>
        <button className="join-item btn" onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })} disabled={pagination.currentPage === pagination.totalPages}>»</button>
      </div>
      <dialog id="edit_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Constituent</h3>
          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input type="text" name="first_name" value={editFormData.first_name} onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })} placeholder="First Name" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Middle Name</span>
                </label>
                <input type="text" name="middle_name" value={editFormData.middle_name} onChange={(e) => setEditFormData({ ...editFormData, middle_name: e.target.value })} placeholder="Middle Name" className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input type="text" name="last_name" value={editFormData.last_name} onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })} placeholder="Last Name" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Date of Birth</span>
                </label>
                <input type="date" name="date_of_birth" value={editFormData.date_of_birth} onChange={(e) => setEditFormData({ ...editFormData, date_of_birth: e.target.value })} className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Place of Birth</span>
                </label>
                <input type="text" name="place_of_birth" value={editFormData.place_of_birth} onChange={(e) => setEditFormData({ ...editFormData, place_of_birth: e.target.value })} placeholder="Place of Birth" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Gender</span>
                </label>
                <input type="text" name="gender" value={editFormData.gender} onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })} placeholder="Gender" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Civil Status</span>
                </label>
                <input type="text" name="civil_status" value={editFormData.civil_status} onChange={(e) => setEditFormData({ ...editFormData, civil_status: e.target.value })} placeholder="Civil Status" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                <input type="text" name="address" value={editFormData.address} onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })} placeholder="Address" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Contact Number</span>
                </label>
                <input type="text" name="contact_number" value={editFormData.contact_number} onChange={(e) => setEditFormData({ ...editFormData, contact_number: e.target.value })} placeholder="Contact Number" className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input type="email" name="email" value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} placeholder="Email" className="input input-bordered" />
              </div>
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Update</button>
              <button type="button" className="btn" onClick={() => document.getElementById('edit_modal').close()}>Close</button>
            </div>
          </form>
        </div>
      </dialog>
    </Layout>
  );
};

export default Constituents;