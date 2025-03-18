'use client';

import editFormAtom from '@/atoms/edit_form';
import journalAtom from '@/atoms/journal';
import newFormAtom from '@/atoms/new_form';
import {Button} from '@/components/ui/button';
import journalEntries from '@/data/journal-entries';
import {AnimatePresence, motion} from 'framer-motion';
import {useAtom} from 'jotai';
import {BookOpen, Plus} from 'lucide-react';
import {useState} from 'react';
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

	const [isEditDialogOpen, setIsEditDialogOpen] = useAtom(editFormAtom);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [__, setEditingEntry] = useAtom(journalAtom);

	const [showNewEntryForm, setShowNewEntryForm] = useAtom(newFormAtom);

	const handleDeleteEntry = (id: string) => {
		setEntries(entries.filter((entry) => entry.id !== id));
	};

	const startEditing = (entry: JournalEntry) => {
		setEditingEntry(entry);
		setIsEditDialogOpen(true);
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

				<AnimatePresence mode='wait'>
					{!showNewEntryForm && (
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
						<div className='text-center py-16 px-4'>
							<div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4'>
								<BookOpen className='h-8 w-8 text-muted-foreground' />
							</div>
							<h3 className='text-xl font-medium mb-2'>Your journal is empty</h3>
							<p className='text-muted-foreground max-w-md mx-auto mb-6'>
								Start capturing your thoughts and memories by creating your first journal entry.
							</p>
							<Button onClick={() => setShowNewEntryForm(true)}>Create First Entry</Button>
						</div>
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
								{entries.map((entry, index) => (
									<motion.div
										key={entry.id}
										initial={{opacity: 0, y: 20}}
										animate={{opacity: 1, y: 0}}
										exit={{opacity: 0, x: -100}}
										transition={{delay: index * 0.05}}>
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
