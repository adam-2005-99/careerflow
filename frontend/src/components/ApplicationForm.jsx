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
    jobUrl,
    setJobUrl,
    notes,
    setNotes,
    handleSubmit, 
    handleCancelEdit,
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

                <div className="form-group">
                    <label>Job URL</label>
                    <input
                        type="url"
                        value={jobUrl}
                        onChange={(event) => setJobUrl(event.target.value)}
                        placeholder="https://..."
                    />
                </div>

                <div className="form-group">
                    <label>Notes</label>
                    <textarea
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        rows="4"
                    />
                </div>

                <div className="form-actions">
                    <button className="primary-button" type="submit">
                        {editingId !== null ? "Update Application" : "Add Application"}
                    </button>

                    {editingId !== null && (
                        <button
                            className="secondary-button"
                            type="button"
                            onClick={handleCancelEdit}
                            >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default ApplicationForm;