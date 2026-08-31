import { useState, useEffect } from 'react';
import api from '../../api/axios';
import RulesCard from '../../components/RulesCard';
import InspectionCard from '../../components/InspectionCard';
import PickupCard from '../../components/PickupCard';
import DeliveryCard from '../../components/DeliveryCard';
import HistoryCard from '../../components/HistoryCard';
import EmptyState from '../../components/EmptyState';

const tabs = [
  { id: 'queue', label: 'Pending Inspections' },
  { id: 'pickups', label: 'Scheduled Pickups' },
  { id: 'deliveries', label: 'Deliveries' },
  { id: 'earnings', label: "Today's Earnings" },
  { id: 'history', label: 'History' },
];

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState('queue');
  const [inspections, setInspections] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pendingRes, pickupRes, deliveryRes, earningsRes, historyRes] = await Promise.all([
        api.get('/inspections/pending'),
        api.get('/inspections/awaiting-pickup'),
        api.get('/orders/delivery-queue'),
        api.get('/earnings/today'),
        api.get('/inspections/history'),
      ]);
      setInspections(pendingRes.data);
      setPickups(pickupRes.data);
      setDeliveries(deliveryRes.data);
      setEarnings(earningsRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      setError('Failed to load agent data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDecided = (inspectionId) => {
    setInspections(inspections.filter((i) => i._id !== inspectionId));
    fetchAll();
  };

  const handlePickupUpdated = (updated, removedId) => {
    if (removedId) {
      setPickups(pickups.filter((p) => p._id !== removedId));
      fetchAll();
    } else if (updated) {
      setPickups(pickups.map((p) => (p._id === updated._id ? updated : p)));
    }
  };

  const handleDelivered = (orderId) => {
    setDeliveries(deliveries.filter((d) => d._id !== orderId));
    fetchAll();
  };

  const tabButtonStyle = (id) => ({
    borderBottom: activeTab === id ? '2.5px solid var(--brand)' : '2.5px solid transparent',
    color: activeTab === id ? 'var(--brand)' : 'var(--ink-muted)',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="font-display text-xl font-bold mb-1">Agent Dashboard</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--ink-muted)' }}>
        Inspect submissions, deliver orders, and track your daily earnings.
      </p>

      <RulesCard />

      <div className="flex gap-6 mb-5 overflow-x-auto" style={{ borderBottom: '1px solid var(--border)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="pb-3 text-sm font-semibold whitespace-nowrap"
            style={tabButtonStyle(tab.id)}
          >
            {tab.label}
            {tab.id === 'queue' && inspections.length > 0 && ` (${inspections.length})`}
            {tab.id === 'pickups' && pickups.length > 0 && ` (${pickups.length})`}
            {tab.id === 'deliveries' && deliveries.length > 0 && ` (${deliveries.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--ink-muted)' }}>Loading...</p>
      ) : error ? (
        <p style={{ color: 'var(--danger)' }}>{error}</p>
      ) : (
        <>
          {activeTab === 'queue' && (
            inspections.length === 0 ? (
              <EmptyState title="No pending inspections" subtitle="New submissions will appear here" />
            ) : (
              inspections.map((inspection) => (
                <InspectionCard key={inspection._id} inspection={inspection} onDecided={handleDecided} />
              ))
            )
          )}

          {activeTab === 'pickups' && (
            pickups.length === 0 ? (
              <EmptyState title="No pickups scheduled" subtitle="Approved products awaiting pickup will appear here" />
            ) : (
              pickups.map((inspection) => (
                <PickupCard key={inspection._id} inspection={inspection} onUpdated={handlePickupUpdated} />
              ))
            )
          )}

          {activeTab === 'deliveries' && (
            deliveries.length === 0 ? (
              <EmptyState title="No deliveries pending" subtitle="Buyer orders awaiting delivery will appear here" />
            ) : (
              deliveries.map((order) => (
                <DeliveryCard key={order._id} order={order} onDelivered={handleDelivered} />
              ))
            )
          )}

          {activeTab === 'earnings' && earnings && (
            <div>
              <div className="grid grid-cols-3 gap-3 text-center mb-5">
                <div className="rounded-xl p-3" style={{ background: 'var(--brand-light)' }}>
                  <p className="font-display font-bold text-lg" style={{ color: 'var(--brand)' }}>₹{earnings.inspectionTotal}</p>
                  <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>From inspections</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: '#FFFBEB' }}>
                  <p className="font-display font-bold text-lg" style={{ color: 'var(--accent)' }}>₹{earnings.deliveryTotal}</p>
                  <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>From deliveries</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: 'var(--surface-muted)', border: '1px solid var(--border)' }}>
                  <p className="font-display font-bold text-lg">₹{earnings.grandTotal}</p>
                  <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Total today</p>
                </div>
              </div>

              {earnings.inspectionVisits.length === 0 && earnings.deliveries.length === 0 ? (
                <EmptyState title="No visits logged today" subtitle="Complete a pickup or delivery to start earning" />
              ) : (
                <div className="space-y-2">
                  {earnings.inspectionVisits.map((v) => (
                    <div key={v._id} className="flex justify-between text-sm p-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                      <span>Inspection pickup · {v.productId?.name}</span>
                      <span className="font-semibold tabular">₹{v.visitEarning} · {v.distanceKm}km</span>
                    </div>
                  ))}
                  {earnings.deliveries.map((d) => (
                    <div key={d._id} className="flex justify-between text-sm p-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                      <span>Delivery · Order #{d._id.slice(-6)}</span>
                      <span className="font-semibold tabular">₹{d.deliveryEarning} · {d.deliveryDistanceKm}km</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            history.length === 0 ? (
              <EmptyState title="No history yet" subtitle="Your completed inspections will appear here" />
            ) : (
              history.map((inspection) => (
                <HistoryCard key={inspection._id} inspection={inspection} />
              ))
            )
          )}
        </>
      )}
    </div>
  );
}