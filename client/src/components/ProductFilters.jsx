export default function ProductFilters({ filters, onChange }) {
  const handleChange = (e) => onChange({ ...filters, [e.target.name]: e.target.value });

  const pillClass = "border rounded-full px-3.5 py-2 text-sm bg-white outline-none";
  const pillStyle = { borderColor: 'var(--border)' };

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      <input
        name="search"
        placeholder="Search products..."
        value={filters.search}
        onChange={handleChange}
        className={`${pillClass} flex-1 min-w-[180px]`}
        style={pillStyle}
      />
      <select name="category" value={filters.category} onChange={handleChange} className={pillClass} style={pillStyle}>
        <option value="">All Categories</option>
        <option value="FMCG">FMCG</option>
        <option value="OTC Medicine">OTC Medicine</option>
      </select>
      <input name="minPrice" type="number" placeholder="Min ₹" value={filters.minPrice} onChange={handleChange} className={`${pillClass} w-24`} style={pillStyle} />
      <input name="maxPrice" type="number" placeholder="Max ₹" value={filters.maxPrice} onChange={handleChange} className={`${pillClass} w-24`} style={pillStyle} />
      <select name="maxDaysToExpiry" value={filters.maxDaysToExpiry} onChange={handleChange} className={pillClass} style={pillStyle}>
        <option value="">Any expiry</option>
        <option value="7">Within 7 days</option>
        <option value="30">Within 30 days</option>
        <option value="90">Within 90 days</option>
      </select>
    </div>
  );
}