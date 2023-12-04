import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';

import './styles.css';
import logoImage from '../../assets/logo.svg'

export default function NewBook() {

  const [id, setId] = useState(null);
  const [author, setAuthor] = useState('');
  const [launchDate, setLaunchDate] = useState('');
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');

  const { bookId } = useParams();

  const username = localStorage.getItem('username');
  const accessToken = localStorage.getItem('accessToken');

  async function loadBook() {
    try {
      const response = await api.get(`api/book/v1/${bookId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });


      let adjustecDate = response.data.launchDate.split('T', 10)[0];

      setId(response.data.id);
      setAuthor(response.data.author);
      setLaunchDate(adjustecDate);
      setPrice(response.data.price);
      setTitle(response.data.title);
    } catch (error) {
      alert(`Error recovering Book! Try again! ${error}`);
      navigate('/books')
    }
  }

  useEffect(() => {
    if (bookId === '0') return;
    else loadBook();
  }, [bookId])

  const navigate = useNavigate();

  async function saveOrUpdate(e) {
    e.preventDefault();

    const data = {
      author,
      launchDate,
      price,
      title,
    };

    try {

      if (bookId === '0') {
        //Save
        await api.post('api/book/v1', data, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      } else {
        //update
        data.id = bookId;
        await api.post('api/book/v1', data, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      }



      navigate('/books');
    } catch (error) {
      alert('Error while recording Book! Try again!');
    }
  }

  return (
    <div className="new-book-container">
      <div className="content">
        <section className="form">
          <img src={logoImage} alt="Logo" />
          <h1>{bookId === '0' ? 'Add New Book' : 'Update Book'}</h1>
          <p>Enter the book information and click on {bookId === '0' ? 'Add' : 'Update'}!</p>
          <Link className="back-link" to="/books">
            <FiArrowLeft size={16} color="#251fc5" />
            Back to books
          </Link>
        </section>
        <form onSubmit={saveOrUpdate}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder='Title' />
          <input
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder='Author' />
          <input
            value={launchDate}
            onChange={e => setLaunchDate(e.target.value)}
            type="date" />
          <input
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder='Price' />

          <button className="button" type='submit'>{bookId === '0' ? 'Add' : 'Update'}</button>
        </form>
      </div>
    </div>
  );
}