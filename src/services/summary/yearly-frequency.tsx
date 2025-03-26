import ApiClient from '@/config/axios';
import {useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';

export interface Frequency {
	date: string;
	count: number;
}

export const getFrequency = async ({token}: {token: string}) => {
	const year = new Date().getFullYear();

	const url = `analytics/yearly-frequency?year=${year}`;
	const client = ApiClient({token});
	const results: Frequency[] = await client.get(url).then((res) => {
		return res.data;
	});
	return results;
};

const useFrequency = ({initialData}: {initialData: Frequency[]}) => {
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
		queryKey: ['journals', {mode: 'frequency'}],
		queryFn: () => getFrequency({token}),
		initialData,
	});
};

export default useFrequency;
