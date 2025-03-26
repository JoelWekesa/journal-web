import {options} from '@/app/api/auth/[...nextauth]/options';
import CategoryManagement from '@/components/categories';
import {getCategories} from '@/services/categories/list';
import {getServerSession} from 'next-auth';
import React from 'react';

const Categories = async () => {
	const session = await getServerSession(options);

	const token = session?.accessToken as string;

	const initialData = await getCategories({token});

	return <CategoryManagement token={token} initialData={initialData} />;
};

export default Categories;
