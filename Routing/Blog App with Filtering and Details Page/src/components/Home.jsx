import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './style.css'
const Home = () => {

    const [data, setData] = useState([]);
    const fetchData = async() =>{
        const res = await fetch('https://fakestoreapi.com/products');
        const result = await res.json();
        console.log(result)
        setData(result)
    };

    useEffect(()=>{
        fetchData();
    }, [])
  return (
    <div className='posts'>
      {data.map((post => (
        <div key={post.id} className="post-card">
            <img src={post.image} alt="" />
            <h4>{post.category}</h4>
            <p>{post.title}</p>
            <strong>{post.price}</strong>
            <Link to={`/product/${post.id}`}>View Product </Link>
        </div>
      )))}
    </div>
  )
}

export default Home
