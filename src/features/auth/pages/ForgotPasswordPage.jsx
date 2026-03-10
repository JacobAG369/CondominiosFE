import { useSearch } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import Card from "../../../components/ui/Card";
import StepRequestCode from "../components/StepRequestCode";
import StepVerifyCode from "../components/StepVerifyCode";
import StepNewPassword from "../components/StepNewPassword";

// ── Step indicator dots ────────────────────────────────────────────────────────
function StepDots({ current }) {
    const steps = [
        { n: 1, label: "Correo" },
        { n: 2, label: "Código" },
        { n: 3, label: "Contraseña" },
    ];
    return (
        <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map(({ n, label }, idx) => (
                <div key={n} className="flex items-center gap-2">
                    <div className="flex flex-col items-center gap-1">
                        <div
                            className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                transition-colors duration-300
                ${current === n
                                    ? "bg-primary text-white shadow-md"
                                    : current > n
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200 text-gray-400"}
              `}
                        >
                            {current > n ? "✓" : n}
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">{label}</span>
                    </div>
                    {idx < steps.length - 1 && (
                        <div
                            className={`w-10 h-0.5 mb-4 transition-colors duration-300 ${current > n ? "bg-green-400" : "bg-gray-200"
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

// ── Step titles & subtitles ────────────────────────────────────────────────────
const STEP_TITLES = {
    1: "¿Olvidaste tu contraseña?",
    2: "Verifica tu identidad",
    3: "Nueva contraseña",
};

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ForgotPasswordPage() {
    // TanStack Router: read search params safely with defaults
    const search = useSearch({ from: "/forgot-password" });
    const step = Number(search?.step ?? "1") || 1;
    const email = search?.email ?? "";
    const code = search?.code ?? "";

    return (
        <div className="min-h-screen bg-bg-sand flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                {/* Branding */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">Condominios</h1>
                    <p className="text-gray-600">Sistema de Gestión</p>
                </div>

                <Card>
                    <h2 className="text-2xl font-bold text-text-dark mb-1">
                        {STEP_TITLES[step] ?? STEP_TITLES[1]}
                    </h2>

                    <StepDots current={Math.min(step, 3)} />

                    {step === 1 && <StepRequestCode />}
                    {step === 2 && <StepVerifyCode email={email} />}
                    {step === 3 && <StepNewPassword email={email} code={code} />}

                    <p className="mt-6 text-center text-sm text-gray-600">
                        ¿Recordaste tu contraseña?{" "}
                        <Link
                            to="/login"
                            className="text-primary hover:text-primary-hover font-medium"
                        >
                            Inicia sesión
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    );
}
