import React, {FC} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '../ui/card';
import {Journal} from '@/atoms/journal';
import {CalendarIcon, Pencil, Trash2} from 'lucide-react';
import {format} from 'date-fns';
import {Button} from '../ui/button';

interface Props {
	entry: Journal;
	startEditing: (entry: Journal) => void;
	handleDeleteEntry: (id: string) => void;
}

const JournalEntryComponent: FC<Props> = ({entry, handleDeleteEntry, startEditing}) => {
	return (
		<Card className='overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900'>
			<div className={`h-1 w-full`} />
			<CardHeader className='pb-4'>
				<div className='flex justify-between items-start'>
					<div>
						<CardTitle className='text-xl'>{entry.title}</CardTitle>
						<div className='flex items-center gap-3 mt-2'>
							<span className='text-sm text-muted-foreground flex items-center'>
								<CalendarIcon className='mr-1 h-3 w-3' />
								{format(entry.date, 'MMMM d, yyyy')}
							</span>
							<span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium `}>
								{entry.category}
							</span>
						</div>
					</div>
					<div className='flex gap-1'>
						<Button
							variant='ghost'
							size='icon'
							className='rounded-full h-8 w-8 text-muted-foreground hover:text-foreground'
							onClick={() => startEditing(entry)}>
							<Pencil className='h-4 w-4' />
							<span className='sr-only'>Edit</span>
						</Button>
						<Button
							variant='ghost'
							size='icon'
							className='rounded-full h-8 w-8 text-muted-foreground hover:text-destructive'
							onClick={() => handleDeleteEntry(entry.id)}>
							<Trash2 className='h-4 w-4' />
							<span className='sr-only'>Delete</span>
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<p className='whitespace-pre-line leading-relaxed'>{entry.content}</p>
			</CardContent>
		</Card>
	);
};

export default JournalEntryComponent;
