import {z} from 'zod';
import {Button} from '../ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../ui/card';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {Form, FormField, FormItem, FormMessage} from '../ui/form';
import {Input} from '../ui/input';
import {useAddCategory} from '@/services/categories/add';
import {FC} from 'react';

const validationSchema = z.object({
	name: z.string().nonempty(),
});

const AddCategoryForm: FC<{token: string}> = ({token}) => {
	const form = useForm<z.infer<typeof validationSchema>>({
		resolver: zodResolver(validationSchema),
		defaultValues: {
			name: '',
		},
	});

	const {mutate: add} = useAddCategory();

	const handleSubmit = (data: z.infer<typeof validationSchema>) => {
		add({token, ...data});
	};

	return (
		<Card className='mb-10'>
			<CardHeader>
				<CardTitle>Add New Category</CardTitle>
				<CardDescription>Create a new category to organize your content</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form className='space-y-4' onSubmit={form.handleSubmit(handleSubmit)}>
						<div className='space-y-2'>
							<FormField
								name='name'
								render={({field}) => (
									<FormItem>
										<Input placeholder='Enter category name' {...field} />
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Button type='submit' className='w-full'>
							Add Category
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default AddCategoryForm;
