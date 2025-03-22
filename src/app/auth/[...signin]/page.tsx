import LoginComponent from '@/components/auth/login';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SignIn = async (req: any) => {
	const url = new URL((await req?.searchParams)?.callbackUrl || process.env.NEXT_PUBLIC_DOMAIN);
	return <LoginComponent path={url?.pathname} />;
};

export default SignIn;
