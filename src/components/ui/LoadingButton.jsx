export default function LoadingButton({ isLoading, children, variant = "primary", ...props }) {
    // Si el usuario proporciona className personalizado, usarlo directamente
    // De lo contrario, usar estilos por defecto según la variante
    const baseClasses = "px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2";

    const variantClasses = {
        primary: isLoading || props.disabled
            ? "bg-[#B08968] opacity-60 cursor-not-allowed text-white"
            : "bg-[#B08968] hover:bg-[#9C7A5E] active:scale-95 text-white",
        secondary: isLoading || props.disabled
            ? "bg-gray-300 opacity-60 cursor-not-allowed text-gray-600"
            : "bg-gray-200 hover:bg-gray-300 active:scale-95 text-gray-700",
    };

    // Si hay className custom, solo agregar base + custom, sino usar variant
    const buttonClasses = props.className
        ? `${baseClasses} ${props.className}`
        : `${baseClasses} ${variantClasses[variant]} shadow-sm`;

    return (
        <button
            {...props}
            disabled={isLoading || props.disabled}
            className={buttonClasses}
        >
            {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {isLoading ? "Cargando..." : children}
        </button>
    );
}
