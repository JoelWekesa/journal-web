'use client';

import {passwordRegex} from '@/utils/password-regex';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import {Input} from '../ui/input';
import {Eye, EyeOff} from 'lucide-react';
import {Button} from '../ui/button';
import {signIn} from 'next-auth/react';

const validationSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.regex(
			passwordRegex,
			'Password must contain at least 8 characters, one uppercase, one lowercase, one digit and one special character'
		),
});

const CredentialsLogin = ({path}: {path?: string}) => {
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<z.infer<typeof validationSchema>>({
		resolver: zodResolver(validationSchema),
	});

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const handleSubmit = (data: z.infer<typeof validationSchema>) => {
		signIn('credentials', {
			email: data.email,
			password: data.password,
			callbackUrl: path ?? '/',
		});
	};

	return (
		<Form {...form}>
			<form className='flex flex-col gap-2' onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name='email'
					render={({field}) => (
						<FormItem>
							<FormLabel className='block mb-2'>Email</FormLabel>
							<FormControl>
								<Input
									id='email'
									type='email'
									placeholder='Enter your email address'
									className='border-primary/20 focus-visible:ring-primary'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='password'
					render={({field}) => (
						<FormItem>
							<FormLabel className='block mb-2'>Password</FormLabel>
							<div className='relative'>
								<FormControl>
									<Input
										id='password'
										type={showPassword ? 'text' : 'password'}
										placeholder='Enter your password'
										className='border-primary/20 focus-visible:ring-primary pr-10'
										{...field}
									/>
								</FormControl>
								<Button
									type='button'
									variant='ghost'
									size='icon'
									className='absolute right-0 top-0 h-full px-3'
									onClick={togglePasswordVisibility}
									tabIndex={-1}>
									{showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
									<span className='sr-only'>{showPassword ? 'Hide password' : 'Show password'}</span>
								</Button>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' className='w-full'>
					Sign In
				</Button>
			</form>
		</Form>
	);
};

export default CredentialsLogin;
