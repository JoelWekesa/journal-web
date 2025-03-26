import ApiClient from '@/config/axios';
import {useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';

export interface LongestStreak {
	longestStreak: number;
}

export const getLongestStreak = async ({token}: {token: string}) => {
	const url = 'analytics/longest-streak';
	const client = ApiClient({token});
	const results: LongestStreak = await client.get(url).then((res) => {
		return res.data;
	});
	return results;
};

const useLongestStreak = ({initialData}: {initialData: LongestStreak}) => {
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
		queryKey: ['journals', {mode: 'longest-streak'}],
		queryFn: () => getLongestStreak({token}),
		initialData,
	});
};

export default useLongestStreak;
