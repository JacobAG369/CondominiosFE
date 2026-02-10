export default function StatCard({ title, value, icon, color = "primary" }) {
    const colorClasses = {
        primary: "bg-primary/10 text-primary",
        success: "bg-green-100 text-green-700",
        warning: "bg-yellow-100 text-yellow-700",
        danger: "bg-red-100 text-red-700",
        info: "bg-blue-100 text-blue-700",
    };

    return (
        <div className="bg-white rounded-lg border border-border-soft p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-text-dark">{value}</p>
                </div>
                <div className={`text-4xl p-3 rounded-full ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
