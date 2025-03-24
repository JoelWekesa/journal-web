'use client';
import newFormAtom from '@/atoms/new_form';
import { cn } from '@/lib/utils';
import { useAddJournal } from '@/services/journals/add';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { Check, ChevronsUpDown } from 'lucide-react';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Textarea } from '../ui/textarea';

const categories = ['Personal', 'Work', 'Travel', 'Health', 'Cooking', 'Nature', 'Learning'];

const validationSchema = z.object({
	title: z.string().nonempty(),
	categoryId: z.string().nonempty(),
	content: z.string().nonempty(),
});

const AddJournalForm: FC<{token: string}> = ({token}) => {
	const form = useForm({
		resolver: zodResolver(validationSchema),
		defaultValues: {
			title: '',
			categoryId: '',
			content: '',
		},
	});

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setShowNewEntryForm] = useAtom(newFormAtom);

	const successFn = () => {
		setShowNewEntryForm(false);
		form.reset();
	};

	const {mutate: add} = useAddJournal({successFn});

	const handleSubmit = (data: z.infer<typeof validationSchema>) => {
		setShowNewEntryForm(false);
		add({
			...data,
			token,
		});
	};

	return (
		<Form {...form}>
			<form className='flex flex-col gap-2' onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					name='title'
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
												'w-full justify-between border-primary/20 focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 bg-transparent',
												!field.value && 'text-muted-foreground'
											)}>
											{field.value ? categories.find((cat) => cat === field.value) : 'Select Category'}
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
												{categories.map((cat) => (
													<CommandItem
														value={cat}
														key={cat}
														onSelect={() => {
															form.setValue('categoryId', 'cm8kiopsg0006r8r67g65zld5');
															// Fill form with selected prospect data
														}}>
														{cat}
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
				<Button className='w-full' type='submit'>
					Save Entry
				</Button>
			</form>
		</Form>
	);
};

export default AddJournalForm;
