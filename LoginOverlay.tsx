import React, { useState } from 'react';
import { signInWithGoogle, registerWithEmail, logInWithEmail } from './auth-service';

interface LoginOverlayProps {
    onClose?: () => void;
}

export const LoginOverlay: React.FC<LoginOverlayProps> = ({ onClose }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isSignUp) {
                await registerWithEmail(email, password, fullName);
            } else {
                await logInWithEmail(email, password);
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-6 md:p-8 lg:p-10 shadow-2xl max-w-md w-full text-center animate-fade-in-up relative border border-white/20 dark:border-slate-800" onClick={e => e.stopPropagation()}>
                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                )}
                <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600 rounded-[24px] md:rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-6 md:mb-8 text-sm md:text-base">
                    {isSignUp ? 'Start your journey to better habits.' : 'Log in to sync your progress.'}
                </p>

                {error && (
                    <div className="bg-rose-50 text-rose-600 text-sm font-bold p-3 rounded-xl mb-4 text-left">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    {isSignUp && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-2.5 px-4 md:py-3 md:px-5 text-sm font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-2.5 px-4 md:py-3 md:px-5 text-sm font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-2.5 px-4 md:py-3 md:px-5 text-sm font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log in')}
                    </button>
                </form>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-slate-900 px-4 text-slate-400 font-black tracking-widest">
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                    type="button"
                    className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
                >
                    <span>{isSignUp ? 'Log in' : 'Sign Up'}</span>
                </button>
            </div>
        </div>
    );
};
