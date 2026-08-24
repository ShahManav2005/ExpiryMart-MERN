export default function ProductFilters({ filters, onChange }) {
  const handleChange = (e) => onChange({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        name="search"
        placeholder="Search products..."
        value={filters.search}
        onChange={handleChange}
        className="border p-2 flex-1 min-w-[150px]"
      />
      <select name="category" value={filters.category} onChange={handleChange} className="border p-2">
        <option value="">All Categories</option>
        <option value="FMCG">FMCG</option>
        <option value="OTC Medicine">OTC Medicine</option>
      </select>
      <input
        name="minPrice"
        type="number"
        placeholder="Min ₹"
        value={filters.minPrice}
        onChange={handleChange}
        className="border p-2 w-24"
      />
      <input
        name="maxPrice"
        type="number"
        placeholder="Max ₹"
        value={filters.maxPrice}
        onChange={handleChange}
        className="border p-2 w-24"
      />
      <select name="maxDaysToExpiry" value={filters.maxDaysToExpiry} onChange={handleChange} className="border p-2">
        <option value="">Any expiry</option>
        <option value="7">Within 7 days</option>
        <option value="30">Within 30 days</option>
        <option value="90">Within 90 days</option>
      </select>
    </div>
  );
}