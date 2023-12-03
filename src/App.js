// App.js

import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({
    id: '',
    name: '',
    email: '',
  });

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        const sortedData = data.sort((a, b) => a.id - b.id);
        setUsers(sortedData);
        setFilteredUsers(sortedData);
      });
  }, []);

  const handleSearch = () => {
    const filtered = users.filter(user =>
      Object.values(user).some(value =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleCheckboxChange = (id) => {
    const updatedSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter(rowId => rowId !== id)
      : [...selectedRows, id];
    setSelectedRows(updatedSelectedRows);
  };

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(user => !selectedRows.includes(user.id));
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setSelectedRows([]);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditedUser({ ...user });
  };

  const handleSaveEdit = () => {
    const updatedUsers = users.map(user =>
      user.id === editingUserId ? editedUser : user
    );
    const sortedData = updatedUsers.sort((a, b) => a.id - b.id);
    setUsers(sortedData);
    setFilteredUsers(sortedData);
    setEditingUserId(null);
    setEditedUser({ id: '', name: '', email: '' });
  };

  const handleDelete = (id) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedUsers = filteredUsers.slice(startIndex, endIndex);

  const isFirstPage = currentPage === 1;
  const isLastPage = endIndex >= filteredUsers.length;

  return (
    <div className="App">
      <h1>User Management</h1>

      <div>
        <label htmlFor="search">Search:</label>
        <input
          type="text"
          id="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-icon" onClick={handleSearch}>Search</button>
      </div>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map(user => (
            <tr key={user.id} className={selectedRows.includes(user.id) ? 'selected' : ''}>
              <td><input type="checkbox" onChange={() => handleCheckboxChange(user.id)} /></td>
              <td>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    value={editedUser.id}
                    onChange={(e) => setEditedUser({ ...editedUser, id: e.target.value })}
                  />
                ) : (
                  user.id
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <button className="save" onClick={handleSaveEdit}>Save</button>
                ) : (
                  <button className="edit" onClick={() => handleEdit(user)}>Edit</button>
                )}
                <button className="delete" onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button className="first-page" onClick={() => handlePageChange(1)} disabled={isFirstPage}>First</button>
        <button className="previous-page" onClick={() => handlePageChange(currentPage - 1)} disabled={isFirstPage}>Previous</button>
        <span>Page {currentPage}</span>
        <button className="next-page" onClick={() => handlePageChange(currentPage + 1)} disabled={isLastPage}>Next</button>
        <button className="last-page" onClick={() => handlePageChange(Math.ceil(filteredUsers.length / itemsPerPage))} disabled={isLastPage}>Last</button>
      </div>

      <button id="deleteSelected" className="delete" onClick={handleDeleteSelected}>Delete Selected</button>
    </div>
  );
}

export default App;
