function ApplicationStats({ applications }) {
    const total = applications.length;

    const applied = applications.filter((application) => application.status === "Applied").length;

    const interviews = applications.filter((application) => application.status === "Interview").length;

    const offers = applications.filter((application) => application.status === "Offer").length;

    const rejected = applications.filter((application) => application.status === "Rejected").length;

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <span>Total</span>
                <strong>{total}</strong>
            </div>

            <div className="stat-card">
                <span>Applied</span>
                <strong>{applied}</strong>
            </div>

            <div className="stat-card">
                <span>Interviews</span>
                <strong>{interviews}</strong>
            </div>

            <div className="stat-card">
                <span>Offers</span>
                <strong>{offers}</strong>
            </div>

            <div className="stat-card">
                <span>Rejected</span>
                <strong>{rejected}</strong>
            </div>
        </div>
    );
}

export default ApplicationStats;