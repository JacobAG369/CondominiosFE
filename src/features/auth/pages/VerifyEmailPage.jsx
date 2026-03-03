import { Link } from "@tanstack/react-router";

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-bg-sand flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#B08968]/10">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-[#B08968]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75M21.75 6.75A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0L12 13.5 2.25 6.75"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-text-dark mb-3">
                    Revisa tu correo
                </h1>

                <p className="text-gray-600 mb-2">
                    Te enviamos un enlace de verificación a tu correo electrónico.
                </p>
                <p className="text-gray-500 text-sm mb-8">
                    Haz clic en el enlace del correo para activar tu cuenta y poder
                    acceder a la plataforma. Si no lo encuentras, revisa la carpeta de{" "}
                    <span className="font-medium">spam</span> o correo no deseado.
                </p>

                {/* Divider */}
                <div className="border-t border-[#E7DED5] pt-6">
                    <p className="text-sm text-gray-500">
                        ¿Ya verificaste tu cuenta?{" "}
                        <Link
                            to="/login"
                            className="text-[#B08968] hover:text-[#9a7455] font-medium transition-colors"
                        >
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
