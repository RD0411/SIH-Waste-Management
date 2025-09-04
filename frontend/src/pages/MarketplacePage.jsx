import { useEffect, useState } from "react";
import axios from "axios";

function MarketplacePage() {
  const [items, setItems] = useState([]);

  const loadItems = () => {
    axios.get("http://localhost:5000/api/marketplace")
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  };

  const deleteItem = (id) => {
    axios.delete(`http://localhost:5000/api/marketplace/${id}`)
      .then(() => loadItems())
      .catch(err => console.error(err));
  };

  useEffect(() => { loadItems(); }, []);

  return (
    <div>
      <h2>Marketplace</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Seller</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td>{i.id}</td>
              <td>{i.title}</td>
              <td>₹{i.price}</td>
              <td>{i.sellerId}</td>
              <td><button onClick={() => deleteItem(i.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default MarketplacePage;
