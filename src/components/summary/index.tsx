'use client';

import {BarChart3, CalendarDays, Clock, LineChartIcon, PieChartIcon} from 'lucide-react';
import {FC, useState} from 'react';

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {AverageWordCount} from '@/services/summary/average-word-count';
import {CategoryDistribution} from '@/services/summary/category-distribution';
import {TimeOfDayStats} from '@/services/summary/time-of-day';
import {TotalJournals} from '@/services/summary/total-journals';
import {WordCountByCategory} from '@/services/summary/word-count-by-category';
import {WordCountTrend} from '@/services/summary/word-count-trend';
import {LongestStreak} from '@/services/summary/writing-streak';
import SummaryCategory from './categories';
import JournalHeatMap from './heat-map';
import SummaryOverview from './overview';
import SummaryTimePatterns from './time-patterns';
import SummaryWordCount from './word-count';
import {Frequency} from '@/services/summary/yearly-frequency';

interface Props {
	totalJournals: TotalJournals;
	averageWordCount: AverageWordCount;
	longestStreak: LongestStreak;
	categoriesDistribution: CategoryDistribution[];
	wordCountTrend: WordCountTrend[];
	wordCountByCategory: WordCountByCategory[];
	timeOfDayStats: TimeOfDayStats;
	frequency: Frequency[];
}

const Summary: FC<Props> = ({
	totalJournals,
	averageWordCount,
	longestStreak,
	categoriesDistribution,
	wordCountTrend,
	wordCountByCategory,
	timeOfDayStats,
	frequency,
}) => {
	const [timeRange, setTimeRange] = useState('all');

	return (
		<div className='py-8'>
			<div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Journal Analytics</h1>
					<p className='text-muted-foreground'>Insights and patterns from your journaling habits</p>
				</div>
				<div className='flex items-center space-x-2'>
					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='Select time range' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='week'>Past Week</SelectItem>
							<SelectItem value='month'>Past Month</SelectItem>
							<SelectItem value='year'>Past Year</SelectItem>
							<SelectItem value='all'>All Time</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<Tabs defaultValue='overview' className='mt-6'>
				<TabsList className='grid w-full grid-cols-3 md:w-auto md:grid-cols-6'>
					<TabsTrigger value='overview' className='flex items-center gap-2'>
						<BarChart3 className='h-4 w-4' />
						<span className='hidden md:inline'>Overview</span>
					</TabsTrigger>
					<TabsTrigger value='frequency' className='flex items-center gap-2'>
						<CalendarDays className='h-4 w-4' />
						<span className='hidden md:inline'>Frequency</span>
					</TabsTrigger>
					<TabsTrigger value='categories' className='flex items-center gap-2'>
						<PieChartIcon className='h-4 w-4' />
						<span className='hidden md:inline'>Categories</span>
					</TabsTrigger>
					<TabsTrigger value='wordcount' className='flex items-center gap-2'>
						<LineChartIcon className='h-4 w-4' />
						<span className='hidden md:inline'>Word Count</span>
					</TabsTrigger>
					<TabsTrigger value='timepatterns' className='flex items-center gap-2'>
						<Clock className='h-4 w-4' />
						<span className='hidden md:inline'>Time Patterns</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value='overview' className='mt-6'>
					<SummaryOverview
						initialTotalJournals={totalJournals}
						initialAverageWordCount={averageWordCount}
						initialLongestStreak={longestStreak}
						initialCategoryDistribution={categoriesDistribution}
						initialWordCountTrend={wordCountTrend}
					/>
				</TabsContent>

				<TabsContent value='frequency' className='mt-6'>
					<JournalHeatMap data={frequency} />
				</TabsContent>

				<TabsContent value='categories' className='mt-6'>
					<SummaryCategory initialCategoryDistribution={categoriesDistribution} />
				</TabsContent>

				<TabsContent value='wordcount' className='mt-6'>
					<SummaryWordCount initialAverageWordCountByCategory={wordCountByCategory} initialWordCountTrend={wordCountTrend} />
				</TabsContent>

				<TabsContent value='timepatterns' className='mt-6'>
					<SummaryTimePatterns initialTimeOfDayStats={timeOfDayStats} />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Summary;
