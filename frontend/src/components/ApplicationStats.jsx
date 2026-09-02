import {
    BriefcaseBusiness,
    Send,
    CalendarDays,
    Trophy,
    XCircle
} from "lucide-react";


function ApplicationStats({ applications }) {
    const total = applications.length;

    const applied = applications.filter((application) => application.status === "Applied").length;

    const interviews = applications.filter((application) => application.status === "Interview").length;

    const offers = applications.filter((application) => application.status === "Offer").length;

    const rejected = applications.filter((application) => application.status === "Rejected").length;

    return (
        <div className="stats-grid">
            <div className="stat-card stat-total">
                <div className="stat-icon">
                    <BriefcaseBusiness size={20} />
                </div>

                <div className="stat-content">
                    <span>Total</span>
                    <strong>{total}</strong>
                </div>
            </div>

            <div className="stat-card stat-applied">
                <div className="stat-icon">
                    <Send size={20} />
                </div>

                <div className="stat-content">
                    <span>Applied</span>
                    <strong>{applied}</strong>
                </div>
            </div>

            <div className="stat-card stat-interview">
                <div className="stat-icon">
                    <CalendarDays size={20} />
                </div>

                <div className="stat-content">
                    <span>Interviews</span>
                    <strong>{interviews}</strong>
                </div>
            </div>

            <div className="stat-card stat-offer">
                <div className="stat-icon">
                    <Trophy size={20} />
                </div>

                <div className="stat-content">
                    <span>Offers</span>
                    <strong>{offers}</strong>
                </div>
            </div>

            <div className="stat-card stat-rejected">
                <div className="stat-icon">
                    <XCircle size={20} />
                </div>

                <div className="stat-content">
                    <span>Rejected</span>
                    <strong>{rejected}</strong>
                </div>
            </div>
        </div>
    );
}

export default ApplicationStats;