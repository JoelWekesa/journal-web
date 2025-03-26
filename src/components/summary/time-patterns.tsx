import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Bar, BarChart, CartesianGrid, Cell, Legend, Tooltip, XAxis, YAxis} from 'recharts';
import {ChartContainer} from '../ui/chart';
import useTimeOfDayStats, {TimeOfDayStats} from '@/services/summary/time-of-day';
import {FC, useMemo} from 'react';
import {generateDynamicColors} from '@/utils/generate-colors';

interface Props {
	initialTimeOfDayStats: TimeOfDayStats;
}

const SummaryTimePatterns: FC<Props> = ({initialTimeOfDayStats}) => {
	const {data: initial} = useTimeOfDayStats({initialData: initialTimeOfDayStats});

	const timeOfDayStats = useMemo(() => {
		return Object.keys(initial).map((key) => ({
			time: key,
			count: initial[key as keyof TimeOfDayStats],
		}));
	}, [initial]);

	const COLORS = useMemo(() => generateDynamicColors(timeOfDayStats.length), [timeOfDayStats]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Time-of-Day Writing Patterns</CardTitle>
				<CardDescription>When you tend to write your journal entries</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={{
						count: {label: 'Entries', color: 'hsl(var(--chart-1))'},
					}}
					className='h-96'>
					<BarChart data={timeOfDayStats}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='time' />
						<YAxis />
						<Tooltip />
						<Legend />
						<Bar dataKey='count' name='Entries' fill='var(--color-count)'>
							{timeOfDayStats.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};

export default SummaryTimePatterns;
