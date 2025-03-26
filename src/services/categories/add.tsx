import ApiClient from '@/config/axios';
import {Category} from '@/models/category';
import {Journal} from '@/models/journal';
import {useMutation, useQueryClient} from '@tanstack/react-query';

interface Props {
	name: string;
	token: string;
}

const addCategory = async ({token, ...rest}: Props): Promise<Journal> => {
	const client = ApiClient({token});

	const url = 'categories';

	const results = await client.post(url, rest).then((res) => res.data);

	return results;
};

export const useAddCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addCategory,
		onMutate: async (newCategory) => {
			await queryClient.cancelQueries({
				queryKey: ['categories'],
			});
			const previousCategories = queryClient.getQueryData<Category[]>(['categories']);

			const randomId = Math.random().toString(36).substring(7);
			queryClient.setQueryData<Category[]>(['categories'], (old = []) => [
				{
					...newCategory,
					id: randomId,
					userId: randomId,
					_count: {
						Journal: 0,
					},
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				...old,
			]);
			return {previousCategories};
		},

		onError: (err, newJournal, context) => {
			queryClient.setQueryData(['categories'], context?.previousCategories);
		},

		onSettled: () => {
			queryClient.invalidateQueries({queryKey: ['categories']});
		},
	});
};
