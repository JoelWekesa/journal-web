import ApiClient from '@/config/axios';
import {useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';

export interface TotalJournals {
	totalJournals: number;
}

export const getTotalJournals = async ({token}: {token: string}) => {
	const url = 'analytics/total-journals';
	const client = ApiClient({token});
	const results: TotalJournals = await client.get(url).then((res) => res.data);
	return results;
};

const useTotalJournals = ({initialData}: {initialData: TotalJournals}) => {
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
		queryKey: ['journals', {mode: 'total-journals'}],
		queryFn: () => getTotalJournals({token}),
		initialData,
	});
};

export default useTotalJournals;
