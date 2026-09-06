export default function OrderInvoice({ order, showDeliveryPending = false }) {
  const cardStyle = { background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' };
  const grandTotal = order.totalAmount + (order.deliveryCharge || 0);

  return (
    <div className="rounded-2xl p-5" style={cardStyle}>
      <div className="flex justify-between items-start mb-4 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div>
          <p className="font-display font-bold">Invoice</p>
          <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Order #{order._id?.slice(-6) || 'PENDING'}</p>
        </div>
        {order.createdAt && (
          <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
        )}
      </div>

      {order.deliveryAddress && (
        <div className="mb-4 text-sm">
          <p className="font-medium mb-0.5">Deliver to</p>
          <p style={{ color: 'var(--ink-muted)' }}>{order.deliveryAddress}</p>
        </div>
      )}

      <div className="space-y-1.5 mb-3">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm tabular">
            <span>{item.productId?.name || item.name || 'Product'} × {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="pt-3 space-y-1" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex justify-between text-sm tabular">
          <span style={{ color: 'var(--ink-muted)' }}>Subtotal</span>
          <span>₹{order.totalAmount}</span>
        </div>

        {order.deliveryStatus === 'delivered' ? (
          <div className="flex justify-between text-sm tabular">
            <span style={{ color: 'var(--ink-muted)' }}>Delivery charge</span>
            <span>{order.deliveryCharge > 0 ? `₹${order.deliveryCharge}` : 'Free'}</span>
          </div>
        ) : showDeliveryPending ? (
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--ink-muted)' }}>Delivery charge</span>
            <span style={{ color: 'var(--ink-muted)' }}>Calculated at delivery</span>
          </div>
        ) : null}

        <div className="flex justify-between font-display font-bold text-lg pt-1 tabular">
          <span>Total</span>
          <span>₹{order.deliveryStatus === 'delivered' ? grandTotal : order.totalAmount}</span>
        </div>
      </div>

      {order.paymentMethod && (
        <p className="text-xs mt-3" style={{ color: 'var(--ink-muted)' }}>Payment method: <span className="capitalize">{order.paymentMethod}</span></p>
      )}
    </div>
  );
}