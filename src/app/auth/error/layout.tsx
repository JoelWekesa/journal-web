import type React from 'react';
export default function AuthErrorLayout({children}: {children: React.ReactNode}) {
	return <div className='bg-muted/40 min-h-screen flex flex-col'>{children}</div>;
}
