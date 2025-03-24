import ApiClient from '@/config/axios';
import {Journal} from '@/models/journal';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export interface EditJournalProps {
	id: string;
	title: string;
	content: string;
	categoryId: string;
	token: string;
}

const editJournal = async ({token, ...rest}: EditJournalProps): Promise<Journal> => {
	const client = ApiClient({token});

	const url = 'journals';

	const results = await client.patch(url, rest).then((res) => res.data);

	return results;
};

export const useEditJournal = ({successFn}: {successFn: () => void}) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: editJournal,
		onMutate: async (updatedJournal) => {
			await queryClient.cancelQueries({
				queryKey: ['journals'],
			});
			successFn();
			const previousJournals = queryClient.getQueryData<Journal[]>(['journals']);

			queryClient.setQueryData<Journal[]>(['journals'], (old = []) =>
				old.map((journal) =>
					journal.id === updatedJournal.id ? {...journal, ...updatedJournal, updatedAt: new Date()} : journal
				)
			);
			return {previousJournals};
		},

		onError: (err, updatedJournal, context) => {
			queryClient.setQueryData(['journals'], context?.previousJournals);
		},

		onSettled: () => {
			queryClient.invalidateQueries({queryKey: ['journals']});
			successFn();
		},
	});
};
