function ApplicationFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) {
    return (
        <div className="filters">
            <input
                type="text"
                placeholder="Search by company or role"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
            />

            <div className="filter-chips">
                {["All", "Applied", "Interview", "Offer", "Rejected"].map((status) => (
                    <button
                        key={status}
                        type="button"
                        className={`filter-chip ${
                            statusFilter === status ? "active" : ""
                        }`}
                        onClick={() => setStatusFilter(status)}
                    >
                        <span
                            className={`filter-dot filter-dot-${status.toLowerCase()}`}
                        ></span>

                        {status}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ApplicationFilters;