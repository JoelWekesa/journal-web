import {Notebook} from 'lucide-react';
import Link from 'next/link';
import GoogleSignIn from './google-button';
import CredentialsLogin from './credentials';

export default function LoginComponent({path}: {path?: string}) {
	return (
		<div className='min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-8'>
			<div className='w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl overflow-hidden bg-white dark:bg-gray-900 shadow-xl h-[90vh]'>
				<div className='flex w-full h-[90vh] flex-col items-center justify-center p-8 lg:p-12 bg-gray-50 dark:bg-gray-800'>
					<div className='w-full max-w-sm space-y-8'>
						<div className='flex flex-col items-center space-y-4 text-center'>
							<div className='flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 p-3 rounded-full'>
								<Notebook className='h-6 w-6 text-green-500' />
							</div>
							<h1 className='text-3xl font-bold text-[#2C3E50] dark:text-gray-100'>Journal</h1>
							<p className='text-gray-600 dark:text-gray-400'>Sign in to access your journals</p>
						</div>

						<div className='space-y-6'>
							<CredentialsLogin path={path} />

							<div className='flex items-center justify-center space-x-2'>
								<div className='w-16 h-px bg-gray-200 dark:bg-gray-700'></div>
								<p className='text-gray-400 dark:text-gray-500'>or</p>
								<div className='w-16 h-px bg-gray-200 dark:bg-gray-700'></div>
							</div>

							<GoogleSignIn path={path} />

							<div className='text-center text-sm text-gray-500 dark:text-gray-400'>
								By signing in, you agree to our{' '}
								<Link href='#' className='text-green-500 hover:text-green-400 underline underline-offset-4'>
									Terms of Service
								</Link>{' '}
								and{' '}
								<Link href='#' className='text-green-500 hover:text-green-400 underline underline-offset-4'>
									Privacy Policy
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
