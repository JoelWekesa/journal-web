import ApiClient from '@/config/axios';
import {Category} from '@/models/category';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';

interface Props {
	id: string;
	token: string;
}

const deleteCategory = async ({token, ...rest}: Props): Promise<Category> => {
	const client = ApiClient({token});

	const url = `categories?id=${rest.id}`;

	const results = await client.delete(url).then((res) => res.data);

	return results;
};

export const useDeleteCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCategory,
		onMutate: async ({id}) => {
			await queryClient.cancelQueries({
				queryKey: ['categories'],
			});
			const previousCategories = queryClient.getQueryData<Category[]>(['categories']);

			queryClient.setQueryData<Category[]>(['categories'], (old = []) => old.filter((category) => category.id !== id));
			return {previousCategories};
		},

		onError: (err, newCategory, context) => {
			queryClient.setQueryData(['categories'], context?.previousCategories);
			toast('Could not delete Category');
		},

		onSettled: () => {
			queryClient.invalidateQueries({queryKey: ['categories']});
		},
	});
};
