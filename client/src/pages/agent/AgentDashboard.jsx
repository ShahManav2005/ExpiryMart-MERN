import { useState, useEffect } from 'react';
import api from '../../api/axios';
import RulesCard from '../../components/RulesCard';
import InspectionCard from '../../components/InspectionCard';
import PickupCard from '../../components/PickupCard';
import HistoryCard from '../../components/HistoryCard';
import EmptyState from '../../components/EmptyState';

const tabs = [
  { id: 'queue', label: 'Pending Inspections' },
  { id: 'pickups', label: 'Scheduled Pickups' },
  { id: 'history', label: 'History' },
];

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState('queue');
  const [inspections, setInspections] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pendingRes, pickupRes, historyRes] = await Promise.all([
        api.get('/inspections/pending'),
        api.get('/inspections/awaiting-pickup'),
        api.get('/inspections/history'),
      ]);
      setInspections(pendingRes.data);
      setPickups(pickupRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      setError('Failed to load inspection data');
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

  const tabButtonStyle = (id) => ({
    borderBottom: activeTab === id ? '2.5px solid var(--brand)' : '2.5px solid transparent',
    color: activeTab === id ? 'var(--brand)' : 'var(--ink-muted)',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="font-display text-xl font-bold mb-1">Agent Dashboard</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--ink-muted)' }}>
        Inspect submissions, schedule pickups, and track your history.
      </p>

      <RulesCard />

      <button
        onClick={() => setActiveTab('queue')}
        className="text-white px-4 py-2 rounded-lg text-sm font-semibold mb-6"
        style={{ background: 'var(--brand)' }}
      >
        Start Inspecting →
      </button>

      <div className="flex gap-6 mb-5" style={{ borderBottom: '1px solid var(--border)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="pb-3 text-sm font-semibold"
            style={tabButtonStyle(tab.id)}
          >
            {tab.label}
            {tab.id === 'queue' && inspections.length > 0 && ` (${inspections.length})`}
            {tab.id === 'pickups' && pickups.length > 0 && ` (${pickups.length})`}
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