import JournalManagement from '@/components/journal';
import {getServerSession} from 'next-auth';
import React from 'react';
import {options} from '../api/auth/[...nextauth]/options';
import {journals} from '@/services/journals/list';
import {getCategories} from '@/services/categories/list';

const Journal = async () => {
	const session = await getServerSession(options);

	const token = session?.accessToken as string;

	const cats = getCategories({token});

	const id = journals({token});

	const [categories, initialData] = await Promise.all([cats, id]);

	return <JournalManagement initialData={initialData} token={token} categories={categories} />;
};

export default Journal;
