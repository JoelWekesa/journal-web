'use client';
import editFormAtom from '@/atoms/edit_form';
import journalAtom from '@/atoms/journal';
import {cn} from '@/lib/utils';
import {useEditJournal} from '@/services/journals/edit';
import {zodResolver} from '@hookform/resolvers/zod';
import {useAtom} from 'jotai';
import {Check, ChevronsUpDown} from 'lucide-react';
import {FC, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Button} from '../ui/button';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '../ui/command';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import {Input} from '../ui/input';
import {Popover, PopoverContent, PopoverTrigger} from '../ui/popover';
import {Textarea} from '../ui/textarea';
import {Category} from '@/models/category';
import {useCategories} from '@/services/categories/list';

interface Props {
	token: string;
	cats: Category[];
}

const validationSchema = z.object({
	title: z.string().nonempty(),
	categoryId: z.string().nonempty(),
	content: z.string().nonempty(),
});

const EditJournalForm: FC<Props> = ({token, cats}) => {
	const [journal] = useAtom(journalAtom);

	const {data: categories} = useCategories({initialData: cats});

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setIsEditDialogOpen] = useAtom(editFormAtom);

	const form = useForm<z.infer<typeof validationSchema>>({
		resolver: zodResolver(validationSchema),
		defaultValues: {
			title: journal?.title || '',
			categoryId: journal?.categoryId || '',
			content: journal?.content || '',
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

	const {mutate: edit} = useEditJournal({successFn});

	const handleSubmit = (data: z.infer<typeof validationSchema>) => {
		edit({
			...data,
			token,
			id: journal?.id as string,
		});
	};

	return (
		<Form {...form}>
			<form className='flex flex-col gap-2' onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					name='title'
					control={form.control}
					render={({field}) => (
						<FormItem>
							<FormLabel className='block mb-2'>Title</FormLabel>
							<FormControl>
								<Input
									id='title'
									placeholder='Give your journal entry a title...'
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
					name='categoryId'
					render={({field}) => (
						<FormItem className='flex flex-col'>
							<FormLabel className='block mb-2'>Select Category</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant='outline'
											role='combobox'
											className={cn(
												'w-full justify-between border-primary/20 focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 bg-transparent capitalize',
												!field.value && 'text-muted-foreground'
											)}>
											{field.value ? categories.find(({id: cat}) => cat === field.value)?.name : 'Select Category'}
											<ChevronsUpDown className='opacity-50' />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className='w-[200px] md:w-[400px] p-0'>
									<Command>
										<CommandInput placeholder='Search category...' className='h-9' />
										<CommandList>
											<CommandEmpty>No category found.</CommandEmpty>
											<CommandGroup>
												{categories.map(({id: cat, name}) => (
													<CommandItem
														value={cat}
														key={cat}
														onSelect={() => {
															form.setValue('categoryId', cat);
														}}
														className='capitalize'>
														{name}
														<Check className={cn('ml-auto', cat === field.value ? 'opacity-100' : 'opacity-0')} />
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name='content'
					control={form.control}
					render={({field}) => (
						<FormItem>
							<FormLabel className='block mb-2'>Description</FormLabel>
							<FormControl>
								<Textarea
									id='content'
									placeholder='Write your thoughts, feelings, and experiences...'
									className='min-h-[200px] max-h-[210px] border-primary/20 focus-visible:ring-primary resize-none'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button size='lg' className='rounded-lg px-6 py-2' type='submit'>
					Update Entry
				</Button>
			</form>
		</Form>
	);
};

export default EditJournalForm;
