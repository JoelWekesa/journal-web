'use client';

import editFormAtom from '@/atoms/edit_form';
import journalAtom from '@/atoms/journal';
import newFormAtom from '@/atoms/new_form';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import journalEntries from '@/data/journal-entries';
import {AnimatePresence, motion} from 'framer-motion';
import {useAtom} from 'jotai';
import {BookOpen, Plus, Search, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '../ui/dialog';
import AddJournalForm from './add';
import EditJournalForm from './edit';
import JournalEntryComponent from './entry';

type JournalEntry = {
	id: string;
	title: string;
	content: string;
	category: string;
	date: Date;
	color?: string;
};

const JournalManagement = () => {
	const [entries, setEntries] = useState<JournalEntry[]>(journalEntries);
	const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>(entries);
	const [searchQuery, setSearchQuery] = useState('');
	const [isSearching, setIsSearching] = useState(false);

	const [isEditDialogOpen, setIsEditDialogOpen] = useAtom(editFormAtom);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [__, setEditingEntry] = useAtom(journalAtom);
	const [showNewEntryForm, setShowNewEntryForm] = useAtom(newFormAtom);

	useEffect(() => {
		if (searchQuery.trim() === '') {
			setFilteredEntries(entries);
		} else {
			const lowercasedQuery = searchQuery.toLowerCase();
			setFilteredEntries(
				entries.filter(
					(entry) =>
						entry.title.toLowerCase().includes(lowercasedQuery) ||
						entry.content.toLowerCase().includes(lowercasedQuery) ||
						entry.category.toLowerCase().includes(lowercasedQuery)
				)
			);
		}
	}, [searchQuery, entries]);

	const handleDeleteEntry = (id: string) => {
		setEntries(entries.filter((entry) => entry.id !== id));
	};

	const startEditing = (entry: JournalEntry) => {
		setEditingEntry(entry);
		setIsEditDialogOpen(true);
	};

	const toggleSearch = () => {
		setIsSearching(!isSearching);
		if (isSearching) {
			setSearchQuery('');
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900'>
			<div className='container mx-auto py-10 px-4 max-w-5xl'>
				<div className='text-center mb-12'>
					<div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4'>
						<BookOpen className='h-8 w-8 text-primary' />
					</div>
					<h1 className='text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text'>
						My Journal
					</h1>
					<p className='text-muted-foreground max-w-md mx-auto'>
						Capture your thoughts, memories, and inspirations in one beautiful place
					</p>
				</div>

				{entries.length > 1 && (
					<motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} className='flex justify-center mb-8 gap-3'>
						<AnimatePresence mode='wait'>
							{isSearching ? (
								<motion.div
									initial={{width: 0, opacity: 0}}
									animate={{width: '100%', opacity: 1}}
									exit={{width: 0, opacity: 0}}
									className='relative max-w-md w-full'>
									<Input
										type='text'
										placeholder='Search journal entries...'
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className='pr-10 shadow-sm border-primary/20 focus-visible:ring-primary'
										autoFocus
									/>
									<Button
										size='icon'
										variant='ghost'
										onClick={() => setSearchQuery('')}
										className='absolute right-0 top-0 h-full aspect-square text-muted-foreground hover:text-foreground'>
										{searchQuery ? <X className='h-4 w-4' /> : <Search className='h-4 w-4' />}
									</Button>
								</motion.div>
							) : null}
						</AnimatePresence>

						<div className='flex gap-2'>
							{entries.length > 1 && (
								<Button
									onClick={toggleSearch}
									variant={isSearching ? 'secondary' : 'outline'}
									size='icon'
									className='rounded-full shadow-sm hover:shadow-md transition-all duration-300'>
									<Search className='h-4 w-4' />
								</Button>
							)}
							<Button
								onClick={() => setShowNewEntryForm(true)}
								size='sm'
								className='rounded-full shadow-sm hover:shadow-md transition-all duration-300'>
								<Plus className='h-4 w-4' />
								New Entry
							</Button>
						</div>
					</motion.div>
				)}

				<AnimatePresence mode='wait'>
					{!showNewEntryForm && entries.length <= 1 && (
						<motion.div
							initial={{opacity: 0, y: 20}}
							animate={{
								opacity: 1,
								y: 0,
								transition: {
									type: 'spring',
									stiffness: 400,
									damping: 25,
								},
							}}
							exit={{
								opacity: 0,
								y: -20,
								transition: {
									duration: 0.2,
								},
							}}
							className='flex justify-center mb-8'>
							<Button
								onClick={() => setShowNewEntryForm(true)}
								size='lg'
								className='rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-300'>
								<Plus className='mr-2 h-5 w-5' />
								New Journal Entry
							</Button>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence mode='popLayout'>
					{showNewEntryForm && (
						<motion.div
							initial={{opacity: 0, scale: 0.95, y: -20}}
							animate={{
								opacity: 1,
								scale: 1,
								y: 0,
								transition: {
									type: 'spring',
									stiffness: 300,
									damping: 30,
								},
							}}
							exit={{
								opacity: 0,
								scale: 0.95,
								y: -20,
								transition: {
									duration: 0.2,
								},
							}}
							className='overflow-hidden mb-10'>
							<AddJournalForm />
						</motion.div>
					)}
				</AnimatePresence>

				<div className='space-y-6'>
					{entries.length === 0 ? (
						<div className='text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/5'>
							<div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4'>
								<BookOpen className='h-8 w-8 text-muted-foreground' />
							</div>
							<h3 className='text-xl font-medium mb-2'>Your journal is empty</h3>
							<p className='text-muted-foreground max-w-md mx-auto mb-6'>
								Start capturing your thoughts and memories by creating your first journal entry.
							</p>
							<Button onClick={() => setShowNewEntryForm(true)}>Create First Entry</Button>
						</div>
					) : filteredEntries.length === 0 ? (
						<motion.div
							initial={{opacity: 0}}
							animate={{opacity: 1}}
							className='text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/5'>
							<div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4'>
								<Search className='h-8 w-8 text-muted-foreground' />
							</div>
							<h3 className='text-xl font-medium mb-2'>No matching entries</h3>
							<p className='text-muted-foreground max-w-md mx-auto mb-6'>We could not find any journal entries matching.</p>
							<Button variant='outline' onClick={() => setSearchQuery('')}>
								Clear Search
							</Button>
						</motion.div>
					) : (
						<motion.div
							layout
							className='grid gap-6'
							transition={{
								layout: {
									type: 'spring',
									stiffness: 300,
									damping: 30,
								},
							}}>
							<AnimatePresence>
								{filteredEntries.map((entry, index) => (
									<motion.div
										key={entry.id}
										initial={{opacity: 0, y: 20}}
										animate={{opacity: 1, y: 0}}
										exit={{opacity: 0, x: -100}}
										transition={{delay: index * 0.05}}
										className='bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-primary/5'>
										<JournalEntryComponent entry={entry} handleDeleteEntry={handleDeleteEntry} startEditing={startEditing} />
									</motion.div>
								))}
							</AnimatePresence>
						</motion.div>
					)}
				</div>
			</div>

			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className='sm:max-w-[725px] border-primary/20 shadow-lg'>
					<DialogHeader>
						<DialogTitle className='text-xl text-primary'>Edit Journal Entry</DialogTitle>
						<DialogDescription>Update your memories and thoughts</DialogDescription>
					</DialogHeader>
					<EditJournalForm />
					<DialogFooter>
						<Button>Update Entry</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default JournalManagement;
