import {redirect} from 'next/navigation';

const Home = async () => {
	redirect('/journals');

	return null;
};

export default Home;
