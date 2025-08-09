import React, { useState, useEffect } from 'react';
import './post.css';
import defaultPosts from './postData';
import PostModal from './PostModal';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function Post() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [posts, setPosts] = useState([]);
  const admin = JSON.parse(localStorage.getItem("admin"));

useEffect(() => {
    async function LoadPosts() {
        const querySnapShot = await getDocs(collection(db, "posts"));
        setPosts(querySnapShot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })));
    }
    LoadPosts();

}, [isModalOpen]);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('');
  };

  const handlePostSubmit = async (newPost) => {
    const postRef = collection(db, "posts");
    const docRef = await addDoc(postRef, newPost);
    return docRef.id;
  };

  return (
    <div className="posts-container">
      <div className="post-content-wrapper">
        <div className="post-main">
          <header className="title-container">
            <p className="red-title">POSTS</p>
            <hr className="red-line" />
          </header>

          {posts.map((message, index) => (
  <div className="post-card" key={index} style={{ cursor: 'pointer' }}>
    <div className="post-header">
      <div className="post-author">
        <span className="author-icon">💭</span>
        <span className="author-name">{message.author} - {message.type}</span>
      </div>
      <div className="post-date">{message.date}</div>
    </div>

    <h3 className="post-title">{message.title}</h3>
    <p className="post-body">{message.body}</p>
    <button className="review-button">REVIEW</button>
  </div>
))}

        </div>

        <div className="posting-buttons">
          <button className="post-button" onClick={() => openModal('Quick Post')}>Quick Post</button>
          {admin.type=== "admin" && <button className="post-button" onClick={() => openModal('Announcement')}>Announcement</button>}
          <button className="post-button" onClick={() => openModal('Achievement')}>Achievement</button>
        </div>
      </div>

      {isModalOpen && (
        <PostModal modalType={modalType} isOpen={isModalOpen} onClose={closeModal} onSubmit={handlePostSubmit} />
      )}
    </div>
  );
}