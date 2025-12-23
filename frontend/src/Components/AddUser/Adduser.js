import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Adduser() {
    const history =useNavigate();
    const [inputs,setInputs] =useState({
        name:"",
        gmail:"",
        age:"",
        address:"",
    });

    const handleChange =(e)=>{
        setInputs((prevState)=>({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handlesubmit =(e)=>{
        e.preventDefault();
        console.log(inputs);
        sendRequent().then(()=>history('../dashbord'))
    }

    const sendRequent=async()=>{
        await axios.post("http://localhost:5000/users",{
            name: String (inputs.name),
            gmail: String (inputs.gmail),
            age: String (inputs.age),
            address: String (inputs.address),
        }).then(res =>res.data);
    }
  return (
    <div>
      <h1>Add User</h1>
            <form onSubmit={handlesubmit} style={{
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "10px",
      width: "300px",
      margin: "auto",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>User Information</h2>

      <label htmlFor="name" style={{ display: "block", marginBottom: "5px" }}>Name:</label>
      <input type="text" id="name" name="name" onChange={handleChange} value={inputs.name} required
        style={{
          width: "100%", padding: "8px", marginBottom: "15px",
          border: "1px solid #ccc", borderRadius: "4px"
        }} />

      <label htmlFor="gmail" style={{ display: "block", marginBottom: "5px" }}>Gmail:</label>
      <input type="email" id="gmail" name="gmail" onChange={handleChange}  value={inputs.gmail} required
        style={{
          width: "100%", padding: "8px", marginBottom: "15px",
          border: "1px solid #ccc", borderRadius: "4px"
        }} />

      <label htmlFor="age" style={{ display: "block", marginBottom: "5px" }}>Age:</label>
      <input type="number" id="age" name="age" onChange={handleChange}  value={inputs.age} required min="1"
        style={{
          width: "100%", padding: "8px", marginBottom: "15px",
          border: "1px solid #ccc", borderRadius: "4px"
        }} />

      <label htmlFor="address" style={{ display: "block", marginBottom: "5px" }}>Address:</label>
      <textarea id="address" name="address" onChange={handleChange}  value={inputs.address} required rows="3"
        style={{
          width: "100%", padding: "8px", marginBottom: "15px",
          border: "1px solid #ccc", borderRadius: "4px"
        }}></textarea>

      <button type="submit"
        style={{
          width: "100%", padding: "10px", backgroundColor: "#007bff",
          color: "white", border: "none", borderRadius: "4px", cursor: "pointer"
        }}>
        Submit
      </button>
    </form>
      




    </div>
  )
}

export default Adduser
