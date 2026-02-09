export default function Input({
    label,
    error,
    type = "text",
    placeholder,
    value,
    onChange,
    required = false,
    className = "",
    ...props
}) {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm font-medium text-text-dark">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`px-3 py-2 border border-border-soft rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${error ? "border-red-500" : ""
                    } ${className}`}
                {...props}
            />
            {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
    );
}
