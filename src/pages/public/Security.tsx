import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const SecurityPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background)]">
            <Header />
            <main className="flex-1 pt-24 px-6 lg:px-10 pb-20">
                <div className="mx-auto max-w-3xl prose prose-invert">
                    <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-8">Security</h1>

                    <p className="text-xl text-[var(--text-secondary)] mb-8">
                        We take the security of your data seriously. Here is how we protect your information.
                    </p>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Data Encryption</h3>
                            <p className="text-[var(--text-secondary)]">All data transmitted between your device and our servers is encrypted using industry-standard TLS (Transport Layer Security). Data at rest is encrypted in our databases.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Secure Infrastructure</h3>
                            <p className="text-[var(--text-secondary)]">Our platform is hosted on secure, world-class cloud infrastructure providers that maintain strict physical and digital security controls.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Payment Security</h3>
                            <p className="text-[var(--text-secondary)]">We do not store your credit card information. All payments are processed by secure third-party payment processors (Stripe/Razorpay) that are PCI-DSS compliant.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
