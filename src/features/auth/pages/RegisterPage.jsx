import { Link } from "@tanstack/react-router";
import RegisterForm from "../components/RegisterForm";
import Card from "../../../components/ui/Card";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-bg-sand flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">Condominios</h1>
                    <p className="text-gray-600">Crea tu cuenta para empezar</p>
                </div>

                <Card>
                    <h2 className="text-2xl font-bold text-text-dark mb-1">
                        Registro de Usuario
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Completa el formulario para crear tu perfil de persona.
                    </p>

                    <RegisterForm />

                    <p className="mt-6 text-center text-sm text-gray-600">
                        ¿Ya tienes cuenta?{" "}
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
