import { useState } from "react";
import DashboardPage from "./dashboard";

type AuthState = "login" | "authenticated";
const STATIC_DASHBOARD_PASSWORD = "ZAKI30300";
function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!password || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    if (password !== STATIC_DASHBOARD_PASSWORD) {
      setError("كلمة السر غير صحيحة");
      setIsSubmitting(false);
      return;
    }

    setPassword("");
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#050505] px-4 text-[#f1e7d0]">
      <div className="w-full max-w-md border border-white/[0.12] bg-[#0c0c0c] p-6 shadow-2xl sm:p-8">
        <div className="mb-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#39ff14]">
            GOSTO FOOD / CONTROL
          </p>
          <h1 className="mt-2 font-bebas text-5xl tracking-wide">Espace privé</h1>
          <p className="mt-2 text-sm leading-6 text-white/45">
            Entrez la clé d&apos;accès pour gérer le menu et les prix.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            autoComplete="username"
            value="dashboard"
            readOnly
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
          />
          <label className="block space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
              Mot de passe
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              autoFocus
              className="h-12 w-full border border-white/[0.12] bg-[#050505] px-3 text-[#f1e7d0] outline-none focus:border-[#ff7a00]/70"
              placeholder="••••••••"
            />
          </label>
          {error && (
            <p className="border border-[#ff795f]/30 bg-[#ff795f]/[0.08] px-3 py-2 text-sm text-[#ff9b88]">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={!password || isSubmitting}
            className="h-12 w-full border border-[#ff7a00] bg-[#ff7a00] font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#160b05] transition-colors hover:bg-[#ff9838] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? "Vérification…" : "Entrer dans le dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DashboardAccessGate() {
  const [state, setState] = useState<AuthState>("login");

  if (state === "login") {
    return <LoginPage onSuccess={() => setState("authenticated")} />;
  }

  return <DashboardPage onLogout={() => setState("login")} />;
}
