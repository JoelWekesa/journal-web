import ApiClient from '@/config/axios';
import {useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';

export interface WordCountTrend {
	month: string;
	avgWordCount: number;
	totalWords: number;
}

export const getWordCountTrend = async ({token}: {token: string}) => {
	const url = 'analytics/word-count-trend';
	const client = ApiClient({token});
	const results: WordCountTrend[] = await client.get(url).then((res) => {
		return res.data;
	});
	return results;
};

const useWordCountTrend = ({initialData}: {initialData: WordCountTrend[]}) => {
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
		queryKey: ['journals', {mode: 'word-count-trend'}],
		queryFn: () => getWordCountTrend({token}),
		initialData,
	});
};

export default useWordCountTrend;
