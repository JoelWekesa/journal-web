import {AuthError} from '@/components/auth/error';

const AuthErrorPage = () => {
	return (
		<div className='container flex items-center justify-center min-h-[calc(100vh-200px)]'>
			<div className='w-full max-w-md'>
				<h1 className='text-2xl font-bold mb-6 text-center'>Authentication Error</h1>
				<AuthError />
			</div>
		</div>
	);
};

export default AuthErrorPage;
