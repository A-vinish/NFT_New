import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function PurchaseHistory() {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api
      .get("/transactions")
      .then((res) => setTransactions(res.data.transactions))
      .finally(() => setLoading(false));
  }, [user]);

  if (!authLoading && !user) {
    return (
      <div className="empty-state">
        Log in to view your purchase history.{" "}
        <Link to="/login" style={{ color: "var(--accent-bright)", fontWeight: 600 }}>
          Log in
        </Link>
      </div>
    );
  }

  if (loading) return <div className="empty-state">Loading...</div>;

  if (transactions.length === 0) {
    return <div className="empty-state">No transactions yet.</div>;
  }

  return (
    <div className="transactions-table">
      <table>
        <thead>
          <tr>
            <th>NFT</th>
            <th>Role</th>
            <th>Counterparty</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const isBuyer = tx.buyer?.id === user.id;
            return (
              <tr key={tx.id}>
                <td>
                  <Link to={`/nft/${tx.nft?.id}`} style={{ color: "var(--text)" }}>
                    {tx.nft?.title || "Deleted NFT"}
                  </Link>
                </td>
                <td>
                  <span className={`role-badge ${isBuyer ? "buyer" : "seller"}`}>
                    {isBuyer ? "Bought" : "Sold"}
                  </span>
                </td>
                <td>{isBuyer ? tx.seller?.username : tx.buyer?.username}</td>
                <td>${tx.price}</td>
                <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PurchaseHistory;
