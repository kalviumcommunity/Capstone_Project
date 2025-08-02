import { useState } from 'react';
import axios from 'axios';

export default function FileUploader() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData);
      alert('Upload success!');
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div>
      <h3>Upload a File</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
