function ApplicationForm({
  company,
  setCompany,
  role,
  setRole,
  status,
  setStatus,
  location,
  setLocation,
  editingId,
  handleSubmit,
}) {
    return (
        <div className="card application-form-card">
            <h2>
                {editingId !== null ? "Edit Application" : "Add Application"}
            </h2>

            <form className="application-form" onSubmit={handleSubmit}>
                <div className="form-group">
                <label>Company</label>
                <input
                    type="text"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    required
                />
                </div>

                <div className="form-group">
                <label>Role</label>
                <input
                    type="text"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    required
                />
                </div>

                <div className="form-group">
                    <label>Status</label>
                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                    >
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                <div className="form-group">
                <label>Location</label>
                <input
                    type="text"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                />
                </div>

                <button className="primary-button" type="submit">
                {editingId !== null ? "Update Application" : "Add Application"}
                </button>
            </form>
        </div>
    );
}

export default ApplicationForm;