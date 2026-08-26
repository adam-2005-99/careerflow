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

            <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
            >
                <option value="All">All statuses</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
            </select>
        </div>
    );
}

export default ApplicationFilters;