export default function Button({
    children,
    onClick,
    type = "button",
    variant = "primary",
    disabled = false,
    className = "",
    ...props
}) {
    const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: "bg-primary hover:bg-primary-hover text-white",
        secondary: "bg-secondary hover:bg-secondary-hover text-text-dark",
        danger: "bg-red-500 hover:bg-red-600 text-white",
        outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
