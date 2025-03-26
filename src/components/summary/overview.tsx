import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {BarChart3, Calendar, CalendarDays} from 'lucide-react';
import {ChartContainer} from '../ui/chart';
import {CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis} from 'recharts';
import useTotalJournals, {TotalJournals} from '@/services/summary/total-journals';
import {FC, useMemo} from 'react';
import useAverageWordCount, {AverageWordCount} from '@/services/summary/average-word-count';
import useLongestStreak, {LongestStreak} from '@/services/summary/writing-streak';
import useCategoryDistribution, {CategoryDistribution} from '@/services/summary/category-distribution';
import {capitalizeWords} from '@/utils/capitalize';
import useWordCountTrend, {WordCountTrend} from '@/services/summary/word-count-trend';

interface Props {
	initialTotalJournals: TotalJournals;
	initialAverageWordCount: AverageWordCount;
	initialLongestStreak: LongestStreak;
	initialCategoryDistribution: CategoryDistribution[];
	initialWordCountTrend: WordCountTrend[];
}

const SummaryOverview: FC<Props> = ({
	initialTotalJournals,
	initialAverageWordCount,
	initialLongestStreak,
	initialCategoryDistribution,
	initialWordCountTrend,
}) => {
	const {data: totalJournals} = useTotalJournals({initialData: initialTotalJournals});

	const {data: averageWordCount} = useAverageWordCount({initialData: initialAverageWordCount});

	const {data: longestStreak} = useLongestStreak({initialData: initialLongestStreak});

	const {data: categories} = useCategoryDistribution({initialData: initialCategoryDistribution});

	const {data: wordCountTrend} = useWordCountTrend({initialData: initialWordCountTrend});

	const generateDynamicColors = (count: number) => {
		return Array.from({length: count}, (_, i) => `hsl(${(i * 360) / count}, 70%, 50%)`);
	};

	const cats = useMemo(
		() =>
			categories.map((item) => ({
				name: capitalizeWords(item.category),
				value: item.count,
			})),
		[categories]
	);

	const COLORS = useMemo(() => generateDynamicColors(cats.length), [cats.length]);

	const config = useMemo(
		() =>
			cats.reduce((acc, item, index) => {
				acc[item.name] = {label: item.name, color: COLORS[index]};
				return acc;
			}, {} as Record<string, {label: string; color: string}>),
		[cats, COLORS]
	);

	const trends = useMemo(
		() =>
			wordCountTrend.map((item) => ({
				month: item.month,
				avgWordCount: item.avgWordCount,
				totalWords: item.totalWords,
			})),
		[wordCountTrend]
	);

	return (
		<>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Entries</CardTitle>
						<Calendar className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{totalJournals.totalJournals}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Avg. Word Count</CardTitle>
						<BarChart3 className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{Math.round(averageWordCount.average)}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Longest Writing Streak</CardTitle>
						<CalendarDays className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{longestStreak.longestStreak} {longestStreak.longestStreak > 1 ? 'days' : 'day'}
						</div>
					</CardContent>
				</Card>
			</div>

			<div className='mt-4 grid gap-4 md:grid-cols-2'>
				<Card className='col-span-2'>
					<CardHeader>
						<CardTitle>Category Distribution</CardTitle>
						<CardDescription>Journal entries by category</CardDescription>
					</CardHeader>
					<CardContent className='px-2'>
						<ChartContainer config={config} className='h-80'>
							<PieChart>
								<Pie
									data={cats}
									cx='50%'
									cy='50%'
									labelLine={false}
									outerRadius={100}
									fill='#8884d8'
									dataKey='value'
									nameKey='name'
									label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}>
									{cats.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ChartContainer>
					</CardContent>
				</Card>

				<Card className='col-span-2'>
					<CardHeader>
						<CardTitle>Word Count Trends</CardTitle>
						<CardDescription>Average word count per entry over time</CardDescription>
					</CardHeader>
					<CardContent className='px-2'>
						<ChartContainer
							config={{
								avgWordCount: {label: 'Avg Word Count', color: 'red'},
							}}
							className='h-80'>
							<LineChart data={trends}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='month' />
								<YAxis />
								<Tooltip />
								<Legend />
								<Line type='monotone' dataKey='avgWordCount' stroke='red' activeDot={{r: 8}} />
							</LineChart>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default SummaryOverview;
