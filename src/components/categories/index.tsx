'use client';

import {FC} from 'react';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Category} from '@/models/category';
import {useCategories} from '@/services/categories/list';
import AddCategoryForm from './add';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '../ui/dialog';
import {useAtom} from 'jotai';
import editCategoryAtom from '@/atoms/edit-category';
import EditCategoryForm from './edit';
import categoryAtom from '@/atoms/category';
import {useDeleteCategory} from '@/services/categories/delete';

interface Props {
	token: string;
	initialData: Category[];
}

const CategoryManagement: FC<Props> = ({token, initialData}) => {
	const {data: categories} = useCategories({initialData});

	const {mutate: del} = useDeleteCategory();

	const [isEditDialogOpen, setIsEditDialogOpen] = useAtom(editCategoryAtom);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setCategory] = useAtom(categoryAtom);

	const handleEdit = (category: Category) => {
		setIsEditDialogOpen(true);
		setCategory(category);
	};

	const handleDelete = (id: string) => {
		del({token, id});
	};

	return (
		<div className='container mx-auto py-8 px-3'>
			<div className='flex flex-col md:flex-row justify-between items-start mb-8 gap-4'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Categories</h1>
					<p className='text-muted-foreground mt-1'>Manage and organize your content with categories</p>
				</div>
			</div>

			<AddCategoryForm token={token} />
			<h2 className='text-2xl font-semibold mb-4'>Existing Categories</h2>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
				{categories.map((category) => (
					<Card key={category.id} className='h-full'>
						<CardHeader>
							<CardTitle className='capitalize'>{category.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-sm text-muted-foreground'>
								{category._count.Journal} {category._count.Journal === 1 ? 'item' : 'items'}
							</p>
						</CardContent>
						<CardFooter className='flex justify-between'>
							<Button variant='outline' size='sm' onClick={() => handleEdit(category)}>
								Edit
							</Button>
							<Button
								variant='outline'
								size='sm'
								className='text-destructive hover:text-destructive'
								disabled={category._count.Journal > 0}
								onClick={() => handleDelete(category.id)}>
								Delete
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>

			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className='sm:max-w-[725px] border-primary/20 shadow-lg rounded-xl'>
					<DialogHeader>
						<DialogTitle className='text-2xl text-primary'>Edit Journal Entry</DialogTitle>
						<DialogDescription className='text-base'>Update your memories and thoughts</DialogDescription>
					</DialogHeader>
					<EditCategoryForm token={token} />
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default CategoryManagement;
