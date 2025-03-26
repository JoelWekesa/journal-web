'use client';

import {useState} from 'react';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import {cn} from '@/lib/utils';

type DataPoint = {
	date: string;
	count: number;
};

type HeatMapProps = {
	data: DataPoint[];
};

type MonthData = {
	name: string;
	year: number;
	month: number;
	days: {
		date: string;
		count: number;
		dayOfMonth: number;
		dayOfWeek: number;
	}[];
};

const JournalHeatMap = ({data}: HeatMapProps) => {
	const [hoveredCell, setHoveredCell] = useState<string | null>(null);

	const processData = () => {
		const dateCountMap: Record<string, number> = {};
		data.forEach((item) => {
			dateCountMap[item.date] = item.count;
		});

		const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

		if (sortedData.length === 0) return [];

		const startDate = new Date(sortedData[0].date);
		const endDate = new Date(sortedData[sortedData.length - 1].date);

		const months: MonthData[] = [];
		const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

		while (currentDate <= endDate) {
			const year = currentDate.getFullYear();
			const month = currentDate.getMonth();
			const monthName = currentDate.toLocaleString('default', {month: 'long'});
			const daysInMonth = new Date(year, month + 1, 0).getDate();

			const days = [];

			for (let day = 1; day <= daysInMonth; day++) {
				const date = new Date(year, month, day);
				const dateStr = date.toISOString().split('T')[0];

				days.push({
					date: dateStr,
					count: dateCountMap[dateStr] || 0,
					dayOfMonth: day,
					dayOfWeek: date.getDay(),
				});
			}

			months.push({
				name: monthName,
				year,
				month,
				days,
			});

			currentDate.setMonth(currentDate.getMonth() + 1);
		}

		return months;
	};

	const months = processData();

	const maxCount = Math.max(...data.map((d) => d.count));

	const getColor = (count: number) => {
		if (count === 0) return 'bg-gray-100 dark:bg-gray-800';

		const intensity = Math.min(1, count / Math.max(1, maxCount));

		if (intensity < 0.25) return 'bg-emerald-100 dark:bg-emerald-900';
		if (intensity < 0.5) return 'bg-emerald-200 dark:bg-emerald-800';
		if (intensity < 0.75) return 'bg-emerald-300 dark:bg-emerald-700';
		return 'bg-emerald-400 dark:bg-emerald-600';
	};

	const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	return (
		<div className='space-y-8'>
			{months.map((month) => (
				<div key={`${month.year}-${month.month}`} className='border rounded-lg p-4'>
					<h3 className='text-lg font-medium mb-4'>
						{month.name} {month.year}
					</h3>

					<div className='grid grid-cols-7 gap-1'>
						{daysOfWeek.map((day) => (
							<div key={day} className='text-xs text-center text-gray-500 pb-1'>
								{day.substring(0, 1)}
							</div>
						))}

						{Array.from({length: month.days[0].dayOfWeek}).map((_, i) => (
							<div key={`empty-start-${i}`} className='h-8'></div>
						))}

						{month.days.map((day) => {
							const formattedDate = new Date(day.date).toLocaleDateString();

							return (
								<TooltipProvider key={day.date}>
									<Tooltip>
										<TooltipTrigger asChild>
											<div className='relative'>
												<div
													className={cn(
														'w-full pt-[100%] rounded-md cursor-pointer transition-colors',
														getColor(day.count),
														hoveredCell === day.date ? 'ring-2 ring-offset-1 ring-primary' : ''
													)}
													onMouseEnter={() => setHoveredCell(day.date)}
													onMouseLeave={() => setHoveredCell(null)}
												/>
												<div className='absolute top-1 left-1 text-xs text-gray-500'>{day.dayOfMonth}</div>
											</div>
										</TooltipTrigger>
										<TooltipContent side='top'>
											<div className='text-xs'>
												<div>{formattedDate}</div>
												<div>
													{day.count} contribution{day.count !== 1 ? 's' : ''}
												</div>
											</div>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							);
						})}

						{/* Empty cells for days after the end of the month */}
						{Array.from({length: (7 - ((month.days[0].dayOfWeek + month.days.length) % 7)) % 7}).map((_, i) => (
							<div key={`empty-end-${i}`} className='h-8'></div>
						))}
					</div>
				</div>
			))}

			<div className='flex items-center mt-4 text-xs text-gray-500'>
				<span className='mr-2'>Less</span>
				<div className='flex gap-1'>
					<div className='w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800'></div>
					<div className='w-3 h-3 rounded-sm bg-emerald-100 dark:bg-emerald-900'></div>
					<div className='w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-800'></div>
					<div className='w-3 h-3 rounded-sm bg-emerald-300 dark:bg-emerald-700'></div>
					<div className='w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-600'></div>
				</div>
				<span className='ml-2'>More</span>
			</div>
		</div>
	);
};

export default JournalHeatMap;
