import ApiClient from '@/config/axios';
import {Category} from '@/models/category';
import {useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';

const getCategories = async ({token}: {token: string}) => {
	const url = 'categories';

	const client = ApiClient({token});

	const results: Category[] = await client.get(url).then((res) => res.data);

	return results;
};

export const useCategories = ({initialData}: {initialData: Category[]}) => {
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
		queryKey: ['categories'],
		queryFn: () => getCategories({token}),
		initialData,
	});
};
