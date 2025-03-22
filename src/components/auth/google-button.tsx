'use client';

import {Button} from '@/components/ui/button';
import {signIn} from 'next-auth/react';
import {useState} from 'react';

export default function GoogleSignIn({path}: {path?: string}) {
	const [isLoading, setIsLoading] = useState(false);

	const handleSignIn = async () => {
		setIsLoading(true);
		try {
			await signIn('google', {
				redirect: true,
				callbackUrl: path || '/',
			});
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			variant='outline'
			className='w-full h-12 flex items-center justify-center space-x-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all hover:text-gray-700'
			onClick={handleSignIn}
			disabled={isLoading}>
			{isLoading ? (
				<div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent' />
			) : (
				<>
					<svg className='h-6 w-6' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
						<path
							fill='#4285F4'
							d='M12 12v-2.4h10.4c0.2 1.2 0.4 2.4 0.4 3.6 0 4.8-3.2 8.8-8 9.6l-1.6-4c3.2-0.8 5.6-3.2 6.4-6h-7.2z'
						/>
						<path
							fill='#34A853'
							d='M4.8 14.4l-4 2c1.6 3.2 5.2 6.4 9.6 6.4 2.8 0 5.2-0.8 7.2-2.4l-3.2-2.8c-1.2 0.8-2.4 1.2-4 1.2-3.6 0-6.4-2.4-7.6-5.6z'
						/>
						<path
							fill='#FBBC05'
							d='M2.4 7.2l-3.2-2.4C1.2 2.4 3.6 1.6 6.4 1.6c2.8 0 5.2 1.2 7.2 3.2l-3.2 3.2c-1.2-1.2-2.8-1.6-4-1.6-2.4 0-4.4 1.2-5.6 3.2z'
						/>
						<path
							fill='#EA4335'
							d='M12 2.4c2.8 0 5.6 1.2 7.2 3.2l-3.2 3.2c-1.2-1.2-2.8-2.4-4-2.4-3.6 0-6.4 2.4-7.6 5.6L0 10.4c1.6-3.6 5.6-6.4 10.4-6.4z'
						/>
					</svg>
					<span className='text-sm font-medium'>Sign in with Google</span>
				</>
			)}
		</Button>
	);
}
