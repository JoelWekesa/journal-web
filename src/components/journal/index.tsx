'use client';
import editFormAtom from '@/atoms/edit_form';
import journalAtom from '@/atoms/journal';
import newFormAtom from '@/atoms/new_form';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {Button} from '@/components/ui/button';
import type {Journal} from '@/models/journal';
import {useJournals} from '@/services/journals/list';
import {Avatar, AvatarFallback, AvatarImage} from '@radix-ui/react-avatar';
import dayjs from 'dayjs';
import Fuse from 'fuse.js';
import {useAtom} from 'jotai';
import {BookOpen, Edit, Plus, Search, Tag, Trash2} from 'lucide-react';
import {useSession} from 'next-auth/react';
import {useQueryState} from 'nuqs';
import {type FC, useMemo, useState} from 'react';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '../ui/dialog';
import AddJournalForm from './add';
import EditJournalForm from './edit';
import {useDeleteJournal} from '@/services/journals/delete';

interface Props {
	initialData: Journal[];
	token: string;
}

const JournalManagement: FC<Props> = ({initialData, token}) => {
	const {data: session} = useSession({
		required: true,
	});

	const {data: entries} = useJournals({initialData});

	const [isSearching, setIsSearching] = useState(false);

	const [isEditDialogOpen, setIsEditDialogOpen] = useAtom(editFormAtom);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [journal, setEditingEntry] = useAtom(journalAtom);
	const [showNewEntryForm, setShowNewEntryForm] = useAtom(newFormAtom);

	const [search, setSearchQuery] = useQueryState('search', {defaultValue: ''});

	const fuse = useMemo(
		() =>
			new Fuse(entries, {
				keys: [
					{name: 'title', weight: 0.7},
					{name: 'content', weight: 0.3},
					{name: 'category', weight: 0.5},
				],
			}),
		[entries]
	);

	const filtered = useMemo(() => {
		if (!search) return entries;
		return fuse.search(search).map((result) => result.item);
	}, [search, fuse, entries]);

	const {mutate: del} = useDeleteJournal();

	const handleDeleteEntry = (id: string) => {
		del({id, token});
	};

	const startEditing = (entry: Journal) => {
		setEditingEntry(entry);
		setIsEditDialogOpen(true);
	};

	const toggleSearch = () => {
		setIsSearching(!isSearching);
		if (isSearching) {
			setSearchQuery('');
		}
	};

	const truncateText = (text: string, maxLength = 150) => {
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength) + '...';
	};

	return (
		<div className='min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
			<div className='container mx-auto py-12 px-4 max-w-5xl'>
				<div className='text-center mb-16'>
					<div className='inline-flex items-center justify-center w-20 h-20 rounded-full  mb-6 ring-4 ring-white dark:ring-slate-900 shadow-md'>
						<Avatar className='h-10 w-10'>
							<AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
							<AvatarFallback>{session?.user?.email?.slice(0, 1).toUpperCase()}</AvatarFallback>
						</Avatar>
					</div>
					<h1 className='text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text tracking-tight'>
						Journal
					</h1>
					<p className='text-muted-foreground max-w-md mx-auto text-lg'>
						Capture your thoughts, memories, and inspirations in one beautiful place
					</p>
				</div>

				<div className='flex justify-between items-center mb-8'>
					<div className='flex gap-3'>
						{entries.length > 1 && (
							<Button
								onClick={toggleSearch}
								variant={isSearching ? 'secondary' : 'outline'}
								size='icon'
								className='rounded-full shadow-sm hover:shadow-md'>
								<Search className='h-4 w-4' />
								<span className='sr-only'>Search entries</span>
							</Button>
						)}
						{isSearching && (
							<div className='relative'>
								<input
									type='text'
									value={search || ''}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder='Search journal entries...'
									className='pl-10 pr-4 py-2 rounded-full border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none w-64 bg-white dark:bg-slate-900'
								/>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							</div>
						)}
					</div>
					<Button
						onClick={() => setShowNewEntryForm(true)}
						size='sm'
						className='rounded-full shadow-sm hover:shadow-md px-5 py-2 h-auto'>
						<Plus className='h-4 w-4 mr-2' />
						New Entry
					</Button>
				</div>

				{!showNewEntryForm && entries.length <= 1 && (
					<div className='flex justify-center mb-12'>
						<Button
							onClick={() => setShowNewEntryForm(true)}
							size='lg'
							className='rounded-full px-8 py-6 shadow-md hover:shadow-lg text-lg h-auto'>
							<Plus className='mr-2 h-5 w-5' />
							New Journal Entry
						</Button>
					</div>
				)}

				<Dialog open={showNewEntryForm} onOpenChange={setShowNewEntryForm}>
					<DialogContent className='sm:max-w-[725px] border-primary/20 shadow-lg rounded-xl'>
						<DialogHeader>
							<DialogTitle className='text-2xl text-primary'>Add Journal Entry</DialogTitle>
							<DialogDescription className='text-base'>Add your memories and thoughts</DialogDescription>
						</DialogHeader>
						<AddJournalForm token={token} />
					</DialogContent>
				</Dialog>

				<div className='space-y-8'>
					{entries.length === 0 ? (
						<div className='text-center py-20 px-6 bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-primary/10'>
							<div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6'>
								<BookOpen className='h-10 w-10 text-muted-foreground' />
							</div>
							<h3 className='text-2xl font-medium mb-3'>Your journal is empty</h3>
							<p className='text-muted-foreground max-w-md mx-auto mb-8 text-lg'>
								Start capturing your thoughts and memories by creating your first journal entry.
							</p>
							<Button onClick={() => setShowNewEntryForm(true)} size='lg' className='rounded-full px-6'>
								Create First Entry
							</Button>
						</div>
					) : filtered.length === 0 ? (
						<div className='text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-primary/10'>
							<div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6'>
								<Search className='h-10 w-10 text-muted-foreground' />
							</div>
							<h3 className='text-2xl font-medium mb-3'>No matching entries</h3>
							<p className='text-muted-foreground max-w-md mx-auto mb-8 text-lg'>
								We could not find any journal entries matching &quot;{search}&quot;
							</p>
							<Button variant='outline' onClick={() => setSearchQuery('')} size='lg' className='rounded-full px-6'>
								Clear Search
							</Button>
						</div>
					) : (
						<Accordion type='single' collapsible className='w-full'>
							{filtered.map((entry) => (
								<AccordionItem
									key={entry.id}
									value={entry.id}
									className='mb-4 bg-white dark:bg-slate-900 rounded-2xl shadow-md hover:shadow-lg border border-primary/10 overflow-hidden transition-shadow duration-200'>
									<AccordionTrigger className='px-6 py-4 hover:no-underline'>
										<div className='flex flex-col items-start text-left w-full'>
											<div className='flex justify-between w-full items-center'>
												<h3 className='text-xl font-semibold'>{entry.title}</h3>
												<div className='flex items-center gap-2'>
													{entry.category && (
														<span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary'>
															<Tag className='h-3 w-3 mr-1' />
															{entry.category.name}
														</span>
													)}
													{entry.createdAt && (
														<span className='text-sm text-muted-foreground'>{dayjs(entry.createdAt).format('DD MMMM YYYY')}</span>
													)}
												</div>
											</div>
											<p className='text-muted-foreground mt-2 text-sm'>{truncateText(entry.content || '')}</p>
										</div>
									</AccordionTrigger>
									<AccordionContent className='px-6 pb-6 pt-2'>
										<div className='prose dark:prose-invert max-w-none'>
											{entry.content?.split('\n').map((paragraph, i) => (
												<p key={i}>{paragraph}</p>
											))}
										</div>
										<div className='flex justify-end gap-2 mt-6'>
											<Button
												variant='outline'
												size='sm'
												className='rounded-full'
												onClick={(e) => {
													e.stopPropagation();
													startEditing(entry);
												}}>
												<Edit className='h-4 w-4 mr-1' />
												Edit
											</Button>
											<Button
												variant='destructive'
												size='sm'
												className='rounded-full'
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteEntry(entry.id);
												}}>
												<Trash2 className='h-4 w-4 mr-1' />
												Delete
											</Button>
										</div>
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					)}
				</div>
			</div>

			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className='sm:max-w-[725px] border-primary/20 shadow-lg rounded-xl'>
					<DialogHeader>
						<DialogTitle className='text-2xl text-primary'>Edit Journal Entry</DialogTitle>
						<DialogDescription className='text-base'>Update your memories and thoughts</DialogDescription>
					</DialogHeader>
					<EditJournalForm token={token} />
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default JournalManagement;
