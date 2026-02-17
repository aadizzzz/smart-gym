import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-gray-800 bg-background-dark py-12 px-6 lg:px-10 mt-auto">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                    <div className="col-span-2 lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4 text-white">
                            <span className="material-symbols-outlined text-primary">fitness_center</span>
                            <span className="text-xl font-bold">Smart Gym</span>
                        </div>
                        <p className="max-w-xs text-sm text-text-secondary">The operating system for the modern fitness industry. Built for growth, designed for people.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-white">Product</h4>
                        <a href="#" className="text-sm text-text-secondary hover:text-white">Features</a>
                        <a href="#" className="text-sm text-text-secondary hover:text-white">Pricing</a>
                        <a href="#" className="text-sm text-text-secondary hover:text-white">Hardware</a>
                        <a href="#" className="text-sm text-text-secondary hover:text-white">API</a>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-white">Company</h4>
                        <a href="#" className="text-sm text-text-secondary hover:text-white">About</a>
                        <a href="#" className="text-sm text-text-secondary hover:text-white">Careers</a>
                        <a href="#" className="text-sm text-text-secondary hover:text-white">Blog</a>
                        <a href="#" className="text-sm text-text-secondary hover:text-white">Contact</a>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-white">Legal</h4>
                        <a href="#" className="text-sm text-text-secondary hover:text-white">Privacy</a>
                        <a href="#" className="text-sm text-text-secondary hover:text-white">Terms</a>
                        <a href="#" className="text-sm text-text-secondary hover:text-white">Security</a>
                    </div>
                </div>
                <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-gray-800 pt-8 md:flex-row">
                    <p className="text-sm text-gray-600">© 2024 Smart Gym Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-500 hover:text-white"><span className="sr-only">Twitter</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
