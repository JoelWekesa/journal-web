'use client';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import {Input} from '../ui/input';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '../ui/card';
import {Button} from '../ui/button';
import {CalendarIcon, Check, ChevronsUpDown, X} from 'lucide-react';
import {Popover, PopoverContent, PopoverTrigger} from '../ui/popover';
import {cn} from '@/lib/utils';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '../ui/command';
import {format} from 'date-fns';
import {Calendar} from '../ui/calendar';
import {Textarea} from '../ui/textarea';
import {useAtom} from 'jotai';
import newFormAtom from '@/atoms/new_form';

const categories = ['Personal', 'Work', 'Travel', 'Health', 'Cooking', 'Nature', 'Learning'];

const validationSchema = z.object({
	title: z.string().nonempty(),
	category: z.string().nonempty(),
	date: z.date(),
	content: z.string().nonempty(),
});

const AddJournalForm = () => {
	const form = useForm({
		resolver: zodResolver(validationSchema),
		defaultValues: {
			date: new Date(),
		},
	});

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setShowNewEntryForm] = useAtom(newFormAtom);

	return (
		<Card className='border border-primary/20 shadow-lg overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80'>
			<CardHeader className='pb-4 border-b relative'>
				<Button variant='ghost' size='icon' className='absolute right-4 top-4' onClick={() => setShowNewEntryForm(false)}>
					<X className='h-4 w-4' />
				</Button>
				<CardTitle className='text-xl text-primary'>Create New Entry</CardTitle>
				<CardDescription>Capture this moment in your journal</CardDescription>
			</CardHeader>
			<CardContent className='space-y-6 pt-6'>
				<Form {...form}>
					<form className='flex flex-col gap-2'>
						<FormField
							name='title'
							render={({}) => (
								<FormItem>
									<FormLabel className='block mb-2'>Title</FormLabel>
									<FormControl>
										<Input
											id='title'
											placeholder='Give your journal entry a title...'
											className='border-primary/20 focus-visible:ring-primary'
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
			</CardContent>
			<CardFooter className='border-t bg-muted/30 py-4'>
				<Button className='w-full'>Save Entry</Button>
			</CardFooter>
		</Card>
	);
};

export default AddJournalForm;
