import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts';
import {ChartContainer} from '../ui/chart';
import useWordCountTrend, {WordCountTrend} from '@/services/summary/word-count-trend';
import {FC, useMemo} from 'react';
import useAverageWordCountByCategory, {WordCountByCategory} from '@/services/summary/word-count-by-category';
import {generateDynamicColors} from '@/utils/generate-colors';

interface Props {
	initialWordCountTrend: WordCountTrend[];
	initialAverageWordCountByCategory: WordCountByCategory[];
}

const SummaryWordCount: FC<Props> = ({initialWordCountTrend, initialAverageWordCountByCategory}) => {
	const {data: wordCountTrend} = useWordCountTrend({initialData: initialWordCountTrend});

	const {data: wordCountByCategory} = useAverageWordCountByCategory({initialData: initialAverageWordCountByCategory});

	const trends = useMemo(
		() =>
			wordCountTrend.map((item) => ({
				month: item.month,
				avgWordCount: item.avgWordCount,
				totalWords: item.totalWords,
			})),
		[wordCountTrend]
	);

	const wordCount = useMemo(
		() =>
			wordCountByCategory.map((item) => ({
				category: item.categoryName,
				avgWordCount: item.averageWordCount,
			})),
		[wordCountByCategory]
	);

	const COLORS = useMemo(() => generateDynamicColors(wordCount.length), [wordCount]);

	return (
		<div className='space-y-2'>
			<Card>
				<CardHeader>
					<CardTitle>Word Count Trends</CardTitle>
					<CardDescription>Average word count per entry over time</CardDescription>
				</CardHeader>
				<CardContent>
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
							<Line type='monotone' dataKey='avgWordCount' stroke='var(--color-avgWordCount)' activeDot={{r: 8}} />
						</LineChart>
					</ChartContainer>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Entry Length by Category</CardTitle>
					<CardDescription>Average word count per category</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer
						config={{
							avgWordCount: {label: 'Avg Word Count', color: 'hsl(var(--chart-1))'},
						}}
						className='h-80'>
						<BarChart data={wordCount}>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='category' />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey='avgWordCount' name='Avg Word Count' fill='var(--color-avgWordCount)'>
								{wordCount.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
								))}
							</Bar>
						</BarChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	);
};

export default SummaryWordCount;
