'use client';

import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export const AuthPanel = () => {
  const supabase = getSupabaseBrowserClient();
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_, newSession) => {
      setSession(newSession);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  if (!supabase) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
        Задайте переменные <code>NEXT_PUBLIC_SUPABASE_URL</code> и <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, чтобы включить авторизацию.
      </div>
    );
  }

  const handleSignIn = async () => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (session) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm">
        <div>
          <p className="text-slate-200">Вход выполнен</p>
          <p className="text-xs text-slate-400">{session.user.email}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl border border-white/20 px-3 py-1 text-xs text-white"
        >
          Выйти
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
      <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Supabase Auth</div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2"
      />
      <button
        type="button"
        onClick={handleSignIn}
        disabled={loading}
        className="w-full rounded-xl bg-sky-500 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Вход..." : "Войти"}
      </button>
      {message && <p className="text-xs text-rose-300">{message}</p>}
    </div>
  );
};
