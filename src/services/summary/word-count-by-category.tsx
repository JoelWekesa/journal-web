import ApiClient from '@/config/axios';
import {useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';

export interface WordCountByCategory {
	categoryId: string;
	categoryName: string;
	averageWordCount: number;
}

export const getAverageWordCountByCategory = async ({token}: {token: string}) => {
	const url = 'analytics/average-word-count-by-category';
	const client = ApiClient({token});
	const results: WordCountByCategory[] = await client.get(url).then((res) => {
		return res.data;
	});
	return results;
};

const useAverageWordCountByCategory = ({initialData}: {initialData: WordCountByCategory[]}) => {
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
		queryKey: ['journals', {mode: 'average-word-count-by-category'}],
		queryFn: () => getAverageWordCountByCategory({token}),
		initialData,
	});
};

export default useAverageWordCountByCategory;
