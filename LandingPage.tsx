import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { usePWAInstall } from './usePWAInstall';
import { BuyMeCoffee } from './BuyMeCoffee';
import { PWAInstallModal } from './PWAInstallModal';


interface LandingPageProps {
    onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { platform, isInstalled } = usePWAInstall();
    const [showInstallModal, setShowInstallModal] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden transition-colors duration-300">
            <PWAInstallModal
                isOpen={showInstallModal}
                onClose={() => setShowInstallModal(false)}
                platform={platform}
            />

            {/* 1. Navbar (Floating & Glassmorphism) */}
            <nav className="fixed top-4 left-4 right-4 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 dark:border-slate-800/50 shadow-xl shadow-indigo-100 dark:shadow-none max-w-7xl mx-auto rounded-2xl transition-all duration-300">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">FocusBoard</span>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Features</a>
                            <a href="#testimonials" className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Testimonials</a>
                            <a href="#pricing" className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Pricing</a>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            <ThemeToggle />
                            <button
                                onClick={onLoginClick}
                                className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                                Login
                            </button>
                            <button
                                onClick={onLoginClick}
                                className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-200"
                            >
                                Get Started
                            </button>
                        </div>

                        {/* Mobile Toggle Button */}
                        <div className="md:hidden flex items-center gap-2">
                            <ThemeToggle />
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors p-2"
                            >
                                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-800 shadow-xl shadow-indigo-100 dark:shadow-none p-6 flex flex-col gap-4 animate-fade-in-down mx-0">
                        <a
                            href="#features"
                            className="text-lg font-bold text-slate-600 hover:text-indigo-600 transition-colors p-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Features
                        </a>
                        <a
                            href="#testimonials"
                            className="text-lg font-bold text-slate-600 hover:text-indigo-600 transition-colors p-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Testimonials
                        </a>
                        <a
                            href="#pricing"
                            className="text-lg font-bold text-slate-600 hover:text-indigo-600 transition-colors p-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Pricing
                        </a>
                        <hr className="border-slate-100 my-2" />
                        <button
                            onClick={() => {
                                onLoginClick();
                                setIsMobileMenuOpen(false);
                            }}
                            className="text-lg font-bold text-slate-600 hover:text-indigo-600 transition-colors p-2 text-left"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => {
                                onLoginClick();
                                setIsMobileMenuOpen(false);
                            }}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 w-full"
                        >
                            Get Started
                        </button>
                    </div>
                )}
            </nav>

            {/* 2. Hero Section */}
            <section className="pt-24 pb-12 md:pt-32 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
                    Stop Rotting.<br />
                    <span className="text-indigo-600">Start Building.</span>
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                    Motivation is a lie. Discipline is a system. Join the 1% of students who use data—not willpower—to crush their goals.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={onLoginClick}
                        className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg md:text-xl font-bold hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200 hover:shadow-indigo-300 ring-4 ring-indigo-50"
                    >
                        Start Your Streak 🔥
                    </button>
                    <a
                        href="#features"
                        className="px-8 py-4 rounded-2xl text-lg font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        See How it Works
                    </a>
                </div>

                {/* Social Proof */}
                <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in-up">
                    <div className="flex -space-x-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 overflow-hidden bg-slate-200">
                                <img
                                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}`}
                                    alt="User"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="text-sm font-bold text-slate-600 dark:text-slate-400">
                        <span className="text-orange-500">🔥</span> Join <span className="text-slate-900 dark:text-white font-black">100+ students</span> fixing their focus this week.
                    </div>
                </div>

                {/* 3D Dashboard Preview (Placeholder) */}
                <div className="mt-16 mx-auto max-w-5xl transform hover:scale-[1.01] transition-transform duration-500">
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-slate-200 dark:border-slate-800 p-2 md:p-3 flex items-center justify-center relative overflow-hidden group">
                        <img
                            src="/images/hero-img-1.png"
                            alt="Dashboard Preview"
                            className="rounded-[32px] w-full h-auto object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* 3. Bento Grid Features */}
            <section id="features" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1: Visuals */}
                    <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 col-span-1 md:col-span-2 group">
                        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-3">Gamify Your Discipline.</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Seeing a gap in your streak hurts. Filling it feels amazing. We hacked your dopamine to make hard work addictive.</p>
                    </div>

                    {/* Card 2: Analytics */}
                    <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 group">
                        <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-3">The Truth Mirror.</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Numbers don't lie. See exactly where you're slacking and where you're winning with GitHub-style heatmaps.</p>
                    </div>

                    {/* Card 3: Focus */}
                    <div className="bg-slate-900 dark:bg-slate-800 p-10 rounded-[40px] shadow-sm hover:shadow-xl transition-all duration-300 col-span-1 md:col-span-3 text-center group">
                        <h3 className="text-xl md:text-2xl font-black text-white mb-3">Zero Ads. Zero Clutter. 100% Focus.</h3>
                        <p className="text-slate-400 font-medium">Other apps want your attention. We want your execution. No social feeds, no notifications—just you and your goals.</p>
                    </div>
                </div>
            </section>

            {/* 4. Social Proof */}
            <section id="testimonials" className="py-12 md:py-20 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Testimony 1 */}
                        <div className="bg-slate-50 dark:bg-slate-900 p-6 md:p-8 rounded-3xl">
                            <div className="flex text-indigo-500 mb-4">★★★★★</div>
                            <p className="text-slate-700 dark:text-slate-300 font-bold mb-6">"I used to waste 4 hours a day. FocusBoard made me feel guilty for breaking my streak. Now I code 2 hours daily."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Rahul" alt="User" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">Rahul</p>
                                    <p className="text-xs font-bold text-slate-500">CS Student</p>
                                </div>
                            </div>
                        </div>
                        {/* Testimony 2 */}
                        <div className="bg-slate-50 dark:bg-slate-900 p-6 md:p-8 rounded-3xl">
                            <div className="flex text-indigo-500 mb-4">★★★★★</div>
                            <p className="text-slate-700 dark:text-slate-300 font-bold mb-6">"It’s not an app, it’s a mirror. If the heatmap is empty, I know I failed. If it's green, I sleep like a baby."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah" alt="User" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">Sarah</p>
                                    <p className="text-xs font-bold text-slate-500">Designer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Pricing */}
            <section id="pricing" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Start for free, upgrade when you're ready.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[40px] border border-slate-200 dark:border-slate-800 hover:border-indigo-100 transition-all">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">The Hobbyist</h3>
                        <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6">₹0<span className="text-lg text-slate-400 font-medium">/mo</span></div>
                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-bold"><span className="text-indigo-600">✓</span> Essential Tracking</li>
                            <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-bold"><span className="text-indigo-600">✓</span> Unlimited Habits</li>
                            <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-bold"><span className="text-indigo-600">✓</span> 7-Day History</li>
                        </ul>
                        <button onClick={onLoginClick} className="w-full py-4 rounded-2xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Start Your Streak</button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-slate-900 dark:bg-slate-800 p-6 md:p-10 rounded-[40px] shadow-xl relative overflow-hidden ring-4 ring-indigo-500/20">
                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-black px-4 py-2 rounded-bl-2xl">POPULAR</div>
                        <h3 className="text-xl font-bold text-white mb-2">The Academic Weapon</h3>
                        <div className="text-3xl md:text-4xl font-black text-white mb-2">₹149<span className="text-lg text-slate-500 font-medium">/lifetime</span></div>
                        <div className="mb-6 text-indigo-300 text-sm font-bold bg-indigo-500/10 px-3 py-1 rounded-lg inline-block">Cheaper than a Pizza. Lasts Forever.</div>
                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-3 text-slate-300 font-bold"><span className="text-indigo-400">✓</span> Unlimited History</li>
                            <li className="flex items-center gap-3 text-slate-300 font-bold"><span className="text-indigo-400">✓</span> Advanced Analytics</li>
                            <li className="flex items-center gap-3 text-slate-300 font-bold"><span className="text-indigo-400">✓</span> Dark Mode</li>
                            <li className="flex items-center gap-3 text-slate-300 font-bold"><span className="text-indigo-400">✓</span> Export Data</li>
                        </ul>
                        <button onClick={onLoginClick} className="w-full py-4 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/50 hover:scale-[1.02] active:scale-[0.98]">Join the Top 1%</button>
                    </div>
                </div>
            </section>

            {/* 6. Footer */}
            <footer className="bg-slate-50 dark:bg-slate-950 py-8 md:py-12 border-t border-slate-200 dark:border-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <span className="text-lg font-black text-slate-900 dark:text-white">FocusBoard</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Building the future of personal productivity.</p>
                    </div>

                    <div>
                        <h4 className="font-black text-slate-900 dark:text-white mb-4">Links</h4>
                        <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            <li><Link to="/privacy" className="hover:text-indigo-600">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-indigo-600">Terms of Service</Link></li>
                            <li><Link to="/refund" className="hover:text-indigo-600">Refund Policy</Link></li>
                            <li><Link to="/contact" className="hover:text-indigo-600">Contact Us</Link></li>
                            <li><a href="#" className="hover:text-indigo-600">Twitter / X</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black text-slate-900 dark:text-white mb-4">Newsletter</h4>
                        <div className="flex gap-2">
                            <input type="email" placeholder="Email" className="bg-white dark:bg-slate-900 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500 w-full" />
                            <button className="bg-slate-900 dark:bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-700">→</button>
                        </div>
                    </div>
                </div>
            </footer>
            <BuyMeCoffee />
        </div>
    );
};
