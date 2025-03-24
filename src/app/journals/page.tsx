import JournalManagement from '@/components/journal';
import {getServerSession} from 'next-auth';
import React from 'react';
import {options} from '../api/auth/[...nextauth]/options';
import {journals} from '@/services/journals/list';

const Journal = async () => {
	const session = await getServerSession(options);

	const token = session?.accessToken as string;

	const initialData = await journals({token});

	return <JournalManagement initialData={initialData} token={token} />;
};

export default Journal;
