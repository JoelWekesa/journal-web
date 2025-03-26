import ApiClient from '@/config/axios';
import {Category} from '@/models/category';
import {Journal} from '@/models/journal';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export interface EditCategoryProps {
	id: string;
	token: string;
}

const editCategory = async ({token, ...rest}: EditCategoryProps): Promise<Journal> => {
	const client = ApiClient({token});

	const url = 'categories';

	const results = await client.patch(url, rest).then((res) => res.data);

	return results;
};

export const useEditCategory = ({successFn}: {successFn: () => void}) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: editCategory,
		onMutate: async (updatedCategory) => {
			await queryClient.cancelQueries({
				queryKey: ['categories'],
			});
			successFn();
			const previous = queryClient.getQueryData<Category[]>(['categories']);

			queryClient.setQueryData<Category[]>(['categories'], (old = []) =>
				old.map((category) =>
					category.id === updatedCategory.id ? {...category, ...updatedCategory, updatedAt: new Date()} : category
				)
			);
			return {previous};
		},

		onError: (err, updatedJournal, context) => {
			queryClient.setQueryData(['categories'], context?.previous);
		},

		onSettled: () => {
			queryClient.invalidateQueries({queryKey: ['categories']});
			successFn();
		},
	});
};
