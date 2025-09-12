import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    axios.get('https://dummyjson.com/products')
      .then(res => {
        setProducts(res.data.products);
        const categories = [...new Set(res.data.products.map(p => p.category))];
        setCategoryList(categories);
      });
  }, []);

  const filterAndSort = () => {
    let filtered = [...products];
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (sortOrder === 'low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Product Store</h2>

      <div style={{ marginBottom: '10px' }}>
        <label>Filter by Category: </label>
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="all">All</option>
          {categoryList.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        <label style={{ marginLeft: '20px' }}>Sort by Price: </label>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="default">Default</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>
      </div>

      <div>
        {filterAndSort().map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
