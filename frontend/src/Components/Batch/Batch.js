import React from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';


function Batch(props) {
  const { _id, createDate, status, quantity, removedQuantity, expireDate } = props.batch;
  const history = useNavigate();

  const deleteHandler = async () => {
    await axios.delete(`http://localhost:5000/batches/${_id}`)
      .then(res => res.data)
      .then(() => history("/"));
  };

  return (
    <div>
      <h1>Batch display</h1>
      <h1>batchId: {_id}</h1>
      <h1>createDate: {createDate}</h1>
      <h1>status: {status}</h1>
      <h1>quantity: {quantity}</h1>
      <h1>removedQuantity: {removedQuantity}</h1>
      <h1>expireDate: {expireDate}</h1>
      <Link to={`/batchdetails/${_id}`}>Update</Link>
      <button onClick={deleteHandler}>Delete</button>
    </div>
  );
}


export default Batch
