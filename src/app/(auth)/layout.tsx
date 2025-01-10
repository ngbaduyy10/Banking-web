import React from 'react';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex size-full">
            <div className="lg:w-1/2 w-full">
                {children}
            </div>
            <div className="auth-layout">Welcome to Bright</div>
        </main>
    );
}
