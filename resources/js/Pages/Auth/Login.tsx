import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Eye, EyeOff, LogIn, User, Lock, Train, BarChart3, Settings, Loader2 } from 'lucide-react';

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword?: boolean }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="OPTIMA ONE — Connexion" />

            <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50">
                {/* Sidebar bleue — identique au design */}
                <div
                    className="hidden lg:flex lg:w-80 xl:w-96 flex-col relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(160deg, #1E3A8A 0%, #1D4ED8 55%, #2563EB 100%)',
                    }}
                >
                    {/* Background shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-400/20 rounded-2xl rotate-45 -translate-x-1/2 -translate-y-1/2" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full p-8">
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-lg">
                                <div className="w-6 h-6 bg-white rounded-md rotate-12" />
                            </div>
                            <div>
                                <p className="text-white/60 text-[10px] uppercase tracking-widest">Plateforme</p>
                                <p className="text-white font-bold text-xl tracking-wide leading-tight">OPTIMA ONE</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-10">
                            <h2 className="text-white text-2xl font-bold leading-tight mb-3">
                                Contrôle industriel<br />& gestion simplifiée
                            </h2>
                            <p className="text-white/60 text-sm leading-relaxed">
                                Accédez à votre espace de contrôle industriel et gérez vos opérations toute simplement avec OPTIMA ONE.
                            </p>
                        </div>

                        {/* Feature list */}
                        <div className="space-y-3 flex-1">
                            {[
                                { icon: Train, label: 'Accéder aux fiches tech' },
                                { icon: Settings, label: 'Gestion des utilisateurs' },
                                { icon: BarChart3, label: 'Découvrir le monde professionnel' },
                            ].map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 hover:bg-white/15 transition-colors cursor-default"
                                >
                                    <Icon className="w-4 h-4 text-white/80 shrink-0" />
                                    <span className="text-white/80 text-sm">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-white/15">
                            <p className="text-white/40 text-xs text-center">
                                © 2025 OPTIMA ONE — Tous droits réservés
                            </p>
                        </div>
                    </div>
                </div>

                {/* Formulaire de connexion */}
                <div className="flex-1 flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md animate-slide-up">
                        {/* Mobile logo */}
                        <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)' }}
                            >
                                <div className="w-5 h-5 bg-white rounded-md rotate-12" />
                            </div>
                            <span className="text-xl font-bold text-blue-800">OPTIMA ONE</span>
                        </div>

                        {/* Card */}
                        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-50">
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">Bon retour</h1>
                                <p className="text-gray-500 text-sm">Connectez-vous à votre espace OPTIMA ONE</p>
                            </div>

                            {status && (
                                <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-200">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                {/* Nom d'utilisateur */}
                                <div className="space-y-1.5">
                                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium">
                                        Adresse email
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="Entrez votre mail"
                                            className="w-full pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-11"
                                        />
                                    </div>
                                    {errors.email && <div className="text-sm text-red-600 mt-1">{errors.email}</div>}
                                </div>

                                {/* Mot de passe */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="text-gray-700 text-sm font-medium">
                                            Mot de passe
                                        </label>
                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                                tabIndex={5}
                                            >
                                                Mot de passe oublié ?
                                            </Link>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="Entrez votre mot de passe"
                                            className="w-full pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-11"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            tabIndex={6}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.password && <div className="text-sm text-red-600 mt-1">{errors.password}</div>}
                                </div>

                                {/* Remember me */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        tabIndex={3}
                                    />
                                    <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                                        Se souvenir de moi
                                    </label>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="w-full h-11 flex items-center justify-center text-white rounded-xl font-semibold text-sm gap-2 mt-2 transition-opacity hover:opacity-90 disabled:opacity-50"
                                    tabIndex={4}
                                    disabled={processing}
                                    style={{
                                        background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)',
                                    }}
                                >
                                    {processing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <LogIn className="w-4 h-4" />
                                    )}
                                    {processing ? 'Connexion...' : 'Se connecter'}
                                </button>
                            </form>
                        </div>

                        <p className="text-center text-xs text-gray-400 mt-6">
                            OPTIMA ONE — Plateforme de gestion industrielle
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
