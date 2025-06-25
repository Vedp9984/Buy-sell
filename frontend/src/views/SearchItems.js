import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './SearchItems.css';

const SearchItems = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/items');
        setItems(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchItems();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="search-container">
      <Navbar />
      <h2 className="page-title">Search Items</h2>
      <input
        className="search-input"
        type="text"
        placeholder="Search items"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="categories-container">
        {['clothing', 'grocery', 'electronics', 'others'].map((category) => (
          <label key={category} className="category-label">
            <input
              className="category-checkbox"
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
            {category}
          </label>
        ))}
      </div>
      <ul className="items-list">
        {filteredItems.map((item) => (
          <li key={item._id} className="item-card">
            <Link to={`/items/${item._id}`} className="item-link">
              {item.name}
            </Link>
            <span className="item-price">${item.price}</span>
            <span className="item-vendor">{item.vendor}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchItems;