import ApiClient from '@/config/axios';
import {Journal} from '@/models/journal';
import {useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';

export const journals = async ({token}: {token: string}) => {
	const url = 'journals';

	const client = ApiClient({token});

	const results: Journal[] = await client.get(url).then((res) => res.data);

	return results;
};

export const useJournals = ({initialData}: {initialData: Journal[]}) => {
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
		queryKey: ['journals'],
		queryFn: () => journals({token}),
		initialData,
	});
};
