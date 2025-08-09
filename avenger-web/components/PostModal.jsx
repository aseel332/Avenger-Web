import { sendAnnouncementEmails } from '../src/api';
import './modal.css';
import { useState } from 'react';

export default function PostModal({ onClose, onSubmit, modalType }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const admin = JSON.parse(localStorage.getItem("admin"));
  const avengers = JSON.parse(localStorage.getItem("avengers"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() && description.trim() && author.trim()) {
      const newPost = {
        type: admin.type === "admin"? "Admin" : "Avenger",
        title,
        body: description,
        author,
        date: new Date().toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
}),

      };

      onSubmit(newPost);

      if (modalType === "Announcement") {
      const allEmails = avengers.map(v => v.email);
      await sendAnnouncementEmails(newPost.title, newPost.body, allEmails);
    }
      setTitle('');
      setDescription('');
      setAuthor('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Post {modalType}</h2>
        <form onSubmit={handleSubmit}>
          <label>Author</label>
          <input
            type="text"
            placeholder="Enter author name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <label>Title</label>
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Description</label>
          <textarea
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="modal-buttons">
            <button type="submit" className="submit">Add</button>
            <button type="button" className="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}