import ApiClient from '@/config/axios';
import {Journal} from '@/models/journal';
import {useMutation, useQueryClient} from '@tanstack/react-query';

interface Props {
	title: string;
	content: string;
	categoryId: string;
	token: string;
}

const addJournal = async ({token, ...rest}: Props): Promise<Journal> => {
	const client = ApiClient({token});

	const url = 'journals';

	const results = await client.post(url, rest).then((res) => res.data);

	return results;
};

export const useAddJournal = ({successFn}: {successFn: () => void}) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addJournal,
		onMutate: async (newJournal) => {
			await queryClient.cancelQueries({
				queryKey: ['journals'],
			});
			successFn();
			const previousJournals = queryClient.getQueryData<Journal[]>(['journals']);

			const randomId = Math.random().toString(36).substring(7);
			queryClient.setQueryData<Journal[]>(['journals'], (old = []) => [
				{
					...newJournal,
					id: randomId,
					createdAt: new Date(),
					updatedAt: new Date(),
					userId: '1',
					category: {
						name: 'Updating...',
					},
				},
				...old,
			]);
			return {previousJournals};
		},

		onError: (err, newJournal, context) => {
			queryClient.setQueryData(['journals'], context?.previousJournals);
		},

		onSettled: () => {
			queryClient.invalidateQueries({queryKey: ['journals']});
			successFn();
		},
	});
};
