import ApiClient from '@/config/axios';
import {useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';

export interface AverageWordCount {
	average: number;
}

export const getAverageWordCount = async ({token}: {token: string}) => {
	const url = 'analytics/average-word-count';
	const client = ApiClient({token});
	const results: AverageWordCount = await client.get(url).then((res) => {
		return res.data;
	});
	return results;
};

const useAverageWordCount = ({initialData}: {initialData: AverageWordCount}) => {
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
		queryKey: ['journals', {mode: 'average-word-count'}],
		queryFn: () => getAverageWordCount({token}),
		initialData,
	});
};

export default useAverageWordCount;
