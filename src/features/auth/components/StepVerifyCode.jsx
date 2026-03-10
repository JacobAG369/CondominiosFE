import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { verifyResetCode } from "../../../api/auth";
import Button from "../../../components/ui/Button";

// ── OTP Slot ──────────────────────────────────────────────────────────────────
function OtpSlot({ inputRef, value, onChange, onKeyDown, index, hasError }) {
    return (
        <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={(e) => onChange(e, index)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className={`
        w-11 h-14 text-center text-2xl font-bold border-2 rounded-xl
        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
        transition-colors
        ${hasError ? "border-red-500" : "border-border-soft"}
      `}
        />
    );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function StepVerifyCode({ email }) {
    const router = useRouter();
    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const [codeError, setCodeError] = useState("");
    const refs = useRef(Array.from({ length: 6 }, () => null));

    // Derived: complete 6-char code
    const code = digits.join("");

    const mutation = useMutation({
        mutationFn: verifyResetCode,
        onSuccess: () => {
            router.navigate({
                to: "/forgot-password",
                search: { step: "3", email, code },
                replace: true,
            });
        },
        onError: (err) => {
            setCodeError(
                err?.response?.data?.message || "Código inválido o expirado. Intenta de nuevo."
            );
        },
    });

    // Handle digit input with auto-advance
    const handleChange = (e, idx) => {
        const val = e.target.value.replace(/\D/g, "").slice(-1);
        const next = [...digits];
        next[idx] = val;
        setDigits(next);
        setCodeError("");
        if (val && idx < 5) refs.current[idx + 1]?.focus();
    };

    // Handle Backspace to go back a slot
    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace" && !digits[idx] && idx > 0) {
            refs.current[idx - 1]?.focus();
        }
    };

    // Handle paste across all slots
    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const next = ["", "", "", "", "", ""];
        text.split("").forEach((ch, i) => { next[i] = ch; });
        setDigits(next);
        setCodeError("");
        const focusIdx = Math.min(text.length, 5);
        refs.current[focusIdx]?.focus();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (code.length < 6) {
            setCodeError("Ingresa los 6 dígitos del código.");
            return;
        }
        mutation.mutate({ email, code });
    };

    return (
        <div>
            <p className="text-sm text-gray-500 mb-2">
                Ingresa el código de 6 dígitos que enviamos a:
            </p>
            <p className="text-sm font-semibold text-primary mb-6">{email}</p>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* OTP grid */}
                <div className="flex justify-center gap-2" onPaste={handlePaste}>
                    {digits.map((d, i) => (
                        <OtpSlot
                            key={i}
                            index={i}
                            value={d}
                            inputRef={(el) => (refs.current[i] = el)}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            hasError={!!codeError}
                        />
                    ))}
                </div>

                {codeError && (
                    <p className="text-sm text-red-500 text-center">{codeError}</p>
                )}

                {mutation.isError && !codeError && (
                    <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm text-center">
                        {mutation.error?.response?.data?.message || "Error al verificar el código."}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={mutation.isPending || code.length < 6}
                >
                    {mutation.isPending ? "Verificando..." : "Verificar código"}
                </Button>
            </form>
        </div>
    );
}
