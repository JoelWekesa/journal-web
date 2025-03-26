'use client';
import categoryAtom from '@/atoms/category';
import editCategoryAtom from '@/atoms/edit-category';
import {useEditCategory} from '@/services/categories/edit';
import {zodResolver} from '@hookform/resolvers/zod';
import {useAtom} from 'jotai';
import {FC, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Button} from '../ui/button';
import {Form, FormField, FormItem, FormMessage} from '../ui/form';
import {Input} from '../ui/input';
import {capitalizeWords} from '@/utils/capitalize';

const validationSchema = z.object({
	name: z.string().nonempty(),
});

const EditCategoryForm: FC<{token: string}> = ({token}) => {
	const [category] = useAtom(categoryAtom);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setIsEditDialogOpen] = useAtom(editCategoryAtom);

	const form = useForm<z.infer<typeof validationSchema>>({
		resolver: zodResolver(validationSchema),
		defaultValues: {
			name: capitalizeWords(category?.name as string),
		},
	});

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const preventSelection = (e: any) => {
			if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
				setTimeout(() => {
					e.target.selectionStart = e.target.selectionEnd;
				}, 0);
			}
		};

		document.addEventListener('focus', preventSelection, true);

		return () => {
			document.removeEventListener('focus', preventSelection, true);
		};
	}, []);

	const successFn = () => {
		setIsEditDialogOpen(false);
	};

	const {mutate: edit} = useEditCategory({successFn});

	const handleSubmit = (data: z.infer<typeof validationSchema>) => {
		edit({
			...data,
			token,
			id: category?.id as string,
		});
	};

	return (
		<Form {...form}>
			<form className='flex flex-col gap-2' onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					name='name'
					render={({field}) => (
						<FormItem>
							<Input placeholder='Enter category name' {...field} />
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button size='lg' className='rounded-lg px-6 py-2' type='submit'>
					Update Category
				</Button>
			</form>
		</Form>
	);
};

export default EditCategoryForm;
