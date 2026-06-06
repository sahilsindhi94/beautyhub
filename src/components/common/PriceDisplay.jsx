import React from 'react'
import './PriceDisplay.css'

export default function PriceDisplay({ price, oldPrice, className = '' }) {
  return (
    <div className={`price-display ${className}`}>
      <span className="price-current">₹{price}</span>
      {oldPrice && <span className="price-original">₹{oldPrice}</span>}
    </div>
  )
}
