import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../ui/card';

const mockJournalData = {
	entries: Array.from({length: 100}, (_, i) => ({
		id: i + 1,
		date: new Date(2023, 0, 1 + i),
		category: ['Personal', 'Work', 'Health', 'Travel', 'Learning'][Math.floor(Math.random() * 5)],
		wordCount: Math.floor(Math.random() * 500) + 100,
		timeOfDay: ['Morning', 'Afternoon', 'Evening', 'Night'][Math.floor(Math.random() * 4)],
		mood: ['Happy', 'Sad', 'Neutral', 'Excited', 'Anxious'][Math.floor(Math.random() * 5)],
	})),
};

const SummaryFrequency = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Entry Frequency</CardTitle>
				<CardDescription>Calendar heatmap showing writing consistency</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='h-[400px] w-full'>
					{/* This would be a calendar heatmap component */}
					<div className='grid grid-cols-7 gap-1'>
						{Array.from({length: 7}).map((_, dayIndex) => (
							<div key={dayIndex} className='text-center text-xs text-muted-foreground'>
								{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex]}
							</div>
						))}

						{Array.from({length: 52 * 7}).map((_, i) => {
							const date = new Date();
							date.setDate(date.getDate() - (52 * 7 - i));
							const count = mockJournalData.entries.filter(
								(entry) =>
									entry.date.getDate() === date.getDate() &&
									entry.date.getMonth() === date.getMonth() &&
									entry.date.getFullYear() === date.getFullYear()
							).length;

							let bgColor = 'bg-muted';
							if (count === 1) bgColor = 'bg-emerald-200';
							if (count === 2) bgColor = 'bg-emerald-400';
							if (count >= 3) bgColor = 'bg-emerald-600';

							return (
								<div
									key={i}
									className={`aspect-square rounded-sm ${bgColor} hover:opacity-80`}
									title={`${date.toLocaleDateString()}: ${count} entries`}
								/>
							);
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default SummaryFrequency;
