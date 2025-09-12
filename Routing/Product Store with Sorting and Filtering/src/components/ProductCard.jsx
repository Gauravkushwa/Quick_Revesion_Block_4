import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
  <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
    <h3>{product.title}</h3>
    <p>Price: ${product.price}</p>
    <p>Category: {product.category}</p>
    <Link to={`/product/${product.id}`}>View Details</Link>
  </div>
);

export default ProductCard;
