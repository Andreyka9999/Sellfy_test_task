import React, { useEffect, useState } from "react";
import "./App.css";

// Local icons. For decorative icons, we use alt="",
import fbIcon from "../icons/facebook_logo.ico";
import twIcon from "../icons/tweeter_logo.ico";
import copyIcon from "../icons/copy_icon.ico";
import deleteIcon from "../icons/trash_bin_icon.ico";
import shareIcon from "../icons/share_icon.ico";

// Data source. Returns an object { data: [...], pagination: {...} }
const API = "https://raw.githubusercontent.com/Sellfy/test-assignment-frontend/refs/heads/master/products.json";

export default function App() {
  // products — loaded table rows
  const [products, setProducts] = useState([]);
  // shareItem — current item opened in the Share modal (null = modal closed)
  const [shareItem, setShareItem] = useState(null);

  // Product loading
  useEffect(() => {
    // AbortController — to cancel fetch when unmounting a component
    const controller = new AbortController();

    fetch(API, { signal: controller.signal })
      .then((r) => r.json())
      .then((j) => setProducts(Array.isArray(j?.data) ? j.data : []))
      .catch((err) => {
        if (err.name !== "AbortError") setProducts([]);
      });

    return () => controller.abort();
  }, []);

  // Delete the product by filtering from the state by _id
  const handleDelete = (id) => {
    setProducts((xs) => xs.filter((x) => x._id !== id));
  };

  // Copying a link
  const copyLink = (url) => {
    if (url) navigator.clipboard.writeText(url);
  };


  // Money formatting (price is given in cents devided by 100)
  const formatMoney = (cents, currency = "USD") => {
    return typeof cents === "number"
      ? new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
          cents / 100
        )
      : "—";
  };

  // Placeholder for image 
  const placeholder = 'https://placeholder.pics/svg/300/DEDEDE/555555/No%20image';

  return (
    <div className="container">
      <h1 className="title">Products</h1>
      <div className="card">
        <table className="grid">
          <thead>
            <tr>
              <th className="col-product">Product</th>
              <th className="col-category">Category</th>
              <th className="col-price">Price</th>
              <th className="col-actions"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                {/* Product cell, fixed box under preview + text on the right. */}
                <td className="col-product">
                  <div className="prod">
                    <img
                      className="thumb"
                      src={p.image_url || ""}
                      alt={p.name || "Product image"}
                      onError={(e) => (e.currentTarget.src = placeholder)}
                    />
                    <div className="info">
                      <div className="name">{p.name || "—"}</div>
                      <div className="desc">{p.description || "—"}</div>
                    </div>
                  </div>
                </td>

                {/* Categories */}
                <td className="col-category">
                  <span className="badge">{p.category || "—"}</span>
                </td>

                {/* Prices */}
                <td className="col-price">
                  <b>{formatMoney(p.price, p.currency)}</b>
                </td>

                {/* Actions on a line: open the Share modal / delete the line */}
                <td className="col-actions">
                  <button className="btn" onClick={() => setShareItem(p)}>
                    <img className="ico" src={shareIcon} alt="" /> Share
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => handleDelete(p._id)}
                  >
                    <img className="ico" src={deleteIcon} alt="" /> Delete
                  </button>
                </td>
              </tr>
            ))}

            {/* Empty state */}
            {products.length === 0 && (
              <tr>
                <td className="empty" colSpan={4}>
                  Empty list
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sharing modal. -setShareItems(null) close modal.*/}
      {shareItem && (
        <div
          className="backdrop"
          onClick={(e) => e.target === e.currentTarget && setShareItem(null)}
        >
          <div className="modal">
            <header>Share your product!</header>
            <div className="box">
              {/* Product card in modal window */}
              <div className="share-card">
                <img
                  className="thumb"
                  src={shareItem.image_url || ""}
                  alt=""
                  onError={(e) => (e.currentTarget.src = placeholder)}
                />
                <div>
                  <div className="share-name">
                    {shareItem.name || "Product name"}
                  </div>
                  <div className="share-desc">
                    {shareItem.description || "Product description"}
                  </div>
                </div>
              </div>

              {/* Sharing buttons and service actions */}
              <div className="actions">
                <button className="btn" onClick={() => shareFacebook(shareItem)}>
                  <img className="ico" src={fbIcon} alt="" /> Share
                </button>
                <button className="btn" onClick={() => shareTwitter(shareItem)}>
                  <img className="ico" src={twIcon} alt="" /> Tweet
                </button>
                <button className="btn" onClick={() => copyLink(shareItem.url)}>
                  <img className="ico" src={copyIcon} alt="" /> Copy link
                </button>
                <button
                  className="btn"
                  style={{ marginLeft: "auto" }}
                  onClick={() => setShareItem(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
