export default function Card({ children, className = "", title }) {
    return (
        <div className={`bg-white border border-border-soft rounded-2xl shadow-sm p-6 ${className}`}>
            {title && <h3 className="text-xl font-semibold text-text-dark mb-4">{title}</h3>}
            {children}
        </div>
    );
}
