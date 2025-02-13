import React from 'react';

const FileUpload = ({ handleFileUpload, fileName }) => (
  <div className="flex justify-center mb-4">
    <input
      type="file"
      accept=".csv"
      onChange={handleFileUpload}
      className="hidden"
      id="fileInput"
    />
    <label
      htmlFor="fileInput"
      className="px-4 py-2 bg-[#fabd16] hover:bg-[#f0b20a] text-white rounded-md cursor-pointer"
    >
      Choose File
    </label>
    <span className="ml-4">{fileName}</span>
  </div>
);

export default FileUpload;