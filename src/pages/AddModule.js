import React, { useState } from "react";
import "./AddModule.css";

const AddModule = () => {
  const [rows, setRows] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [partNumber, setPartNumber] = useState(""); // For modal header

  // Handle adding rows
  const addRow = () => {
    setRows([...rows, { partNumber: "", type: "", description: "", rev: "" }]);
  };

  // Handle Save Button Click (Open Modal)
  const handleSaveClick = () => {
    setModalOpen(true);
  };
 const handlePreviewClick = () => {
 };
  // Handle Close Modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="add-module-container">
      {/* Header */}
      <header className="module-header">
        <h2>New Module</h2>
        <div className="header-buttons">
          <button className="preview-button" onClick={handlePreviewClick}>
            Preview
          </button>
          <button className="save-button" onClick={handleSaveClick}>
            Save
          </button>
        </div>
      </header>

      {/* Image Upload Section */}
      <div className="upload-section">
        <label className="upload-box">
          <span>📂 Click or drag file to this area to upload</span>
          <p>Support only single upload. Maximum file size 2MB.</p>
          <input type="file" accept="image/*" className="file-input" />
        </label>
      </div>

      {/* Form Fields */}
      <form className="module-form">
        <div className="form-row">
          <div className="form-group">
            <label>Project ID:</label>
            <input type="text" placeholder="Enter Project ID" />
          </div>
          <div className="form-group">
            <label>Part No.:</label>
            <input
              type="text"
              placeholder="Enter Part No."
              onChange={(e) => setPartNumber(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Flowchart Part Number:</label>
            <input type="text" placeholder="Enter Flowchart Part Number" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Part Description:</label>
            <textarea
              readOnly
              placeholder="Auto-generated description"
            ></textarea>
          </div>
          <div className="form-group full-width">
            <label>Short Description:</label>
            <textarea placeholder="Enter short description"></textarea>
          </div>
        </div>
      </form>

      {/* Table of Procedures */}
      <h3 className="table-heading">Table Of Procedures</h3>
      <table className="procedures-table">
        <thead>
          <tr>
            <th>Part Number</th>
            <th>Type</th>
            <th>Description</th>
            <th>Rev</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <input type="text" placeholder="Part Number" />
              </td>
              <td>
                <input type="text" placeholder="Type" />
              </td>
              <td>
                <input type="text" placeholder="Description" />
              </td>
              <td>
                <input type="text" placeholder="Rev" />
              </td>
              <td className="action-buttons">
                <button className="edit-row">✏️</button>
                <button className="right-arrow">➡️</button>
                <button
                  className="delete-row"
                  onClick={() => setRows(rows.filter((_, i) => i !== index))}
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow} className="add-row-button">
        + Add Row
      </button>

      {/* Save Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-header">Save Product {partNumber}</h3>
            <hr className="divider" /> {/* Divider Below Header */}
            <p className="modal-text">
              For 13310 &gt; Rev D- &gt; Section 1 &gt; Step 1
            </p>
            <p className="modal-text">
              <strong>Editor:</strong> Yamin Khan
            </p>
            <label className="modal-label">Comment:</label>
            <textarea
              className="modal-textarea"
              placeholder="Enter your comments here..."
            ></textarea>
            <hr className="divider" /> {/* Divider Above Buttons */}
            <div className="modal-actions">
              <button className="close-button" onClick={handleCloseModal}>
                Close
              </button>
              <button className="save-button">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddModule;
