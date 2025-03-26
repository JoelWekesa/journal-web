import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import useCategoryDistribution, {CategoryDistribution} from '@/services/summary/category-distribution';
import {capitalizeWords} from '@/utils/capitalize';
import {FC, useMemo} from 'react';
import {Bar, BarChart, CartesianGrid, Cell, Legend, Tooltip, XAxis, YAxis} from 'recharts';
import {ChartContainer} from '../ui/chart';
import {generateDynamicColors} from '@/utils/generate-colors';

interface Props {
	initialCategoryDistribution: CategoryDistribution[];
}

const SummaryCategory: FC<Props> = ({initialCategoryDistribution}) => {
	const {data: categories} = useCategoryDistribution({initialData: initialCategoryDistribution});

	const cats = useMemo(
		() =>
			categories.map((item) => ({
				name: capitalizeWords(item.category),
				value: item.count,
			})),
		[categories]
	);

	const COLORS = useMemo(() => generateDynamicColors(cats.length), [cats]);

	const config = useMemo(
		() =>
			cats.reduce((acc, item, index) => {
				acc[item.name] = {label: item.name, color: COLORS[index]};
				return acc;
			}, {} as Record<string, {label: string; color: string}>),
		[cats, COLORS]
	);

	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Category Distribution</CardTitle>
					<CardDescription>Journal entries by category</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer className='h-96' config={config}>
						<BarChart data={cats}>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='name' />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey='value' name='Entries' fill='#8884d8'>
								{cats.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={COLORS[index]} />
								))}
							</Bar>
						</BarChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	);
};

export default SummaryCategory;
