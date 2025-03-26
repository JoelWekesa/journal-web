import ApiClient from '@/config/axios';
import {useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';

export interface CategoryDistribution {
	category: string;
	count: number;
}

export const getCategoryDistribution = async ({token}: {token: string}) => {
	const url = 'analytics/category-distribution';
	const client = ApiClient({token});
	const results: CategoryDistribution[] = await client.get(url).then((res) => {
		return res.data;
	});
	return results;
};

const useCategoryDistribution = ({initialData}: {initialData: CategoryDistribution[]}) => {
	const {data: session} = useSession({
		required: true,
		onUnauthenticated() {
			return {
				redirect: {
					destination: '/auth/signin',
					permanent: false,
				},
			};
		},
	});

	const token = session?.accessToken as string;

	return useQuery({
		queryKey: ['journals', {mode: 'category-distribution'}],
		queryFn: () => getCategoryDistribution({token}),
		initialData,
	});
};

export default useCategoryDistribution;
