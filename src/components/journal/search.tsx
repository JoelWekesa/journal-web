'use client';

import {motion} from 'framer-motion';
import {useQueryState} from 'nuqs';
import {Input} from '../ui/input';

const SearchComponent = () => {
	const [name, setName] = useQueryState('search', {defaultValue: ''});
	return (
		<motion.div
			initial={{width: 0, opacity: 0}}
			animate={{width: '100%', opacity: 1}}
			exit={{width: 0, opacity: 0}}
			className='relative max-w-md w-full'>
			<Input
				type='search'
				placeholder='Search journal entries...'
				value={name || ''}
				onChange={(e) => setName(e.target.value)}
				className='pr-10 shadow-sm border-primary/20 focus-visible:ring-primary'
				autoFocus
			/>
		</motion.div>
	);
};

export default SearchComponent;
