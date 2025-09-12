import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './style.css'

const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const { id } = useParams();

  const fetchData = async () => {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const result = await res.json();
    console.log(result)
    setProduct(result)
  }

  useEffect(() => {
    fetchData();
  }, [id])
  return (
    <div className="product-details">
      <img src={product.image} alt={product.title} />
      <div className="product-info">
        <h2>{product.category}</h2>
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <div className="price">${product.price}</div>
        <div className="rating">
          <span>⭐ {product.rating?.rate}</span>
          <span>({product.rating?.count} reviews)</span>
        </div>
      </div>
    </div>

  )
}

export default ProductDetails
