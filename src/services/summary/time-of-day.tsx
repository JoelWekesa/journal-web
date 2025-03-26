import ApiClient from '@/config/axios';
import {useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';

export interface TimeOfDayStats {
	morning: number;
	afternoon: number;
	evening: number;
	night: number;
}

export const getTimeOfDayStats = async ({token}: {token: string}) => {
	const url = 'analytics/time-of-day-stats';
	const client = ApiClient({token});
	const results: TimeOfDayStats = await client.get(url).then((res) => {
		return res.data;
	});
	return results;
};

const useTimeOfDayStats = ({initialData}: {initialData: TimeOfDayStats}) => {
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
		queryKey: ['journals', {mode: 'time-of-day-stats'}],
		queryFn: () => getTimeOfDayStats({token}),
		initialData,
	});
};

export default useTimeOfDayStats;
