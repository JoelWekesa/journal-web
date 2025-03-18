'use client';
import journalAtom from '@/atoms/journal';
import {cn} from '@/lib/utils';
import {zodResolver} from '@hookform/resolvers/zod';
import {format} from 'date-fns';
import {useAtom} from 'jotai';
import {CalendarIcon, Check, ChevronsUpDown} from 'lucide-react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Button} from '../ui/button';
import {Calendar} from '../ui/calendar';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '../ui/command';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import {Input} from '../ui/input';
import {Popover, PopoverContent, PopoverTrigger} from '../ui/popover';
import {Textarea} from '../ui/textarea';
import {useEffect} from 'react';

const categories = ['Personal', 'Work', 'Travel', 'Health', 'Cooking', 'Nature', 'Learning'];

const validationSchema = z.object({
	title: z.string().nonempty(),
	category: z.string().nonempty(),
	date: z.date(),
	content: z.string().nonempty(),
});

const EditJournalForm = () => {
	const [journal] = useAtom(journalAtom);

	const form = useForm<z.infer<typeof validationSchema>>({
		resolver: zodResolver(validationSchema),
		defaultValues: {
			date: journal?.date || new Date(),
			title: journal?.title || '',
			category: journal?.category || '',
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

	return (
		<Form {...form}>
			<form className='flex flex-col gap-2'>
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

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<FormField
						control={form.control}
						name='category'
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
																form.setValue('category', cat);
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
						control={form.control}
						name='date'
						render={({field}) => (
							<FormItem className='flex flex-col gap-2'>
								<FormLabel className='block mb-2'>Date</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={'outline'}
												className={cn(
													'w-full pl-3 text-left font-normal border-primary/20 focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 bg-transparent',
													!field.value && 'text-muted-foreground'
												)}>
												{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
												<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className='w-auto p-0' align='start'>
										<Calendar
											mode='single'
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) => date < new Date()}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

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
									className='min-h-[200px] border-primary/20 focus-visible:ring-primary resize-none'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};

export default EditJournalForm;
