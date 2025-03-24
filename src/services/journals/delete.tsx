import ApiClient from '@/config/axios';
import {Journal} from '@/models/journal';
import {useMutation, useQueryClient} from '@tanstack/react-query';

interface Props {
	id: string;
	token: string;
}

const deleteJournal = async ({token, ...rest}: Props): Promise<Journal> => {
	const client = ApiClient({token});

	const url = `journals?id=${rest.id}`;

	const results = await client.delete(url).then((res) => res.data);

	return results;
};

export const useDeleteJournal = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteJournal,
		onMutate: async ({id}) => {
			await queryClient.cancelQueries({
				queryKey: ['journals'],
			});
			const previousJournals = queryClient.getQueryData<Journal[]>(['journals']);

			queryClient.setQueryData<Journal[]>(['journals'], (old = []) => old.filter((journal) => journal.id !== id));
			return {previousJournals};
		},

		onError: (err, newJournal, context) => {
			queryClient.setQueryData(['journals'], context?.previousJournals);
		},

		onSettled: () => {
			queryClient.invalidateQueries({queryKey: ['journals']});
		},
	});
};
