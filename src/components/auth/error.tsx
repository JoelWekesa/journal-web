'use client';

import type React from 'react';

import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import {AlertCircle, AlertTriangle, Ban, Info, XCircle} from 'lucide-react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {useQueryState} from 'nuqs';

type ErrorType = {
	title: string;
	description: string;
	icon: React.ReactNode;
	action?: {
		label: string;
		href: string;
	};
	variant: 'destructive' | 'warning' | 'info';
};

const errorTypes: Record<string, ErrorType> = {
	CredentialsSignin: {
		title: 'Invalid credentials',
		description: 'The email or password you entered is incorrect. Please try again.',
		icon: <XCircle className='h-5 w-5' />,
		action: {
			label: 'Try again',
			href: '/login',
		},
		variant: 'destructive',
	},
	OAuthSignin: {
		title: 'Authentication error',
		description: 'There was a problem signing in with your provider. Please try again.',
		icon: <AlertTriangle className='h-5 w-5' />,
		action: {
			label: 'Back to login',
			href: '/login',
		},
		variant: 'warning',
	},
	OAuthCallback: {
		title: 'Authentication callback error',
		description: 'There was a problem with the authentication callback. Please try again.',
		icon: <AlertTriangle className='h-5 w-5' />,
		action: {
			label: 'Back to login',
			href: '/login',
		},
		variant: 'warning',
	},
	OAuthCreateAccount: {
		title: 'Account creation failed',
		description: 'There was a problem creating your account. Please try again.',
		icon: <AlertTriangle className='h-5 w-5' />,
		action: {
			label: 'Back to sign up',
			href: '/signup',
		},
		variant: 'warning',
	},
	EmailCreateAccount: {
		title: 'Account creation failed',
		description: 'There was a problem creating your account with email. Please try again.',
		icon: <AlertTriangle className='h-5 w-5' />,
		action: {
			label: 'Back to sign up',
			href: '/signup',
		},
		variant: 'warning',
	},
	Callback: {
		title: 'Authentication error',
		description: 'There was a problem with the authentication process. Please try again.',
		icon: <AlertTriangle className='h-5 w-5' />,
		action: {
			label: 'Back to login',
			href: '/login',
		},
		variant: 'warning',
	},
	OAuthAccountNotLinked: {
		title: 'Account not linked',
		description: 'This email is already associated with another account. Please sign in using your original provider.',
		icon: <Ban className='h-5 w-5' />,
		action: {
			label: 'Back to login',
			href: '/login',
		},
		variant: 'info',
	},
	EmailSignin: {
		title: 'Email sign in failed',
		description: 'There was a problem sending the sign in email. Please try again.',
		icon: <AlertTriangle className='h-5 w-5' />,
		action: {
			label: 'Try again',
			href: '/login',
		},
		variant: 'warning',
	},
	SessionRequired: {
		title: 'Authentication required',
		description: 'You need to be signed in to access this page.',
		icon: <Info className='h-5 w-5' />,
		action: {
			label: 'Sign in',
			href: '/login',
		},
		variant: 'info',
	},
	Default: {
		title: 'Authentication error',
		description: 'An unexpected error occurred during authentication. Please try again.',
		icon: <AlertCircle className='h-5 w-5' />,
		action: {
			label: 'Back to login',
			href: '/login',
		},
		variant: 'warning',
	},
};

interface AuthErrorProps {
	error?: string;
	className?: string;
	compact?: boolean;
}

export function AuthError({error, className, compact = false}: AuthErrorProps) {
	// If error is not provided, try to get it from the URL
	const searchParams = useSearchParams();
	const errorFromUrl = searchParams?.get('error');
	const errorType = error || errorFromUrl || 'Default';

	const [errors] = useQueryState('error', {defaultValue: ''});

	const errorInfo = errorTypes[errorType] || errorTypes['Default'];

	if (compact) {
		return (
			<Alert variant='destructive' className={className}>
				<div className='flex items-center gap-2'>
					{errorInfo.icon}
					<AlertTitle>{errorInfo.title}</AlertTitle>
				</div>
				<AlertDescription className='mt-2'>{errorInfo.description}</AlertDescription>
			</Alert>
		);
	}

	return (
		<Card className={`border-destructive ${className}`}>
			<CardHeader className={` flex flex-row items-center gap-2 rounded-t-lg`}>
				{errorInfo.icon}
				<AlertTitle className='text-lg font-semibold'>{errorInfo.title}</AlertTitle>
			</CardHeader>
			<CardContent className='pt-4'>
				<AlertDescription className='text-base'>{errors}</AlertDescription>
			</CardContent>
			{errorInfo.action && (
				<CardFooter className='flex justify-end'>
					<Button asChild>
						<Link href='/auth/signin'>{errorInfo.action.label}</Link>
					</Button>
				</CardFooter>
			)}
		</Card>
	);
}
