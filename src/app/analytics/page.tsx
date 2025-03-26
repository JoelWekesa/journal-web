import Summary from '@/components/summary';
import {getTotalJournals} from '@/services/summary/total-journals';
import {getServerSession} from 'next-auth';
import React from 'react';
import {options} from '../api/auth/[...nextauth]/options';
import {getAverageWordCount} from '@/services/summary/average-word-count';
import {getLongestStreak} from '@/services/summary/writing-streak';
import {getCategoryDistribution} from '@/services/summary/category-distribution';
import {getWordCountTrend} from '@/services/summary/word-count-trend';
import {getAverageWordCountByCategory} from '@/services/summary/word-count-by-category';
import {getTimeOfDayStats} from '@/services/summary/time-of-day';
import {getFrequency} from '@/services/summary/yearly-frequency';

const AnalyticsHome = async () => {
	const session = await getServerSession(options);

	const token = session?.accessToken as string;

	const ttj = getTotalJournals({token});
	const awc = getAverageWordCount({token});
	const lst = getLongestStreak({token});
	const cdb = getCategoryDistribution({token});
	const wct = getWordCountTrend({token});
	const wcbc = getAverageWordCountByCategory({token});
	const tods = getTimeOfDayStats({token});
	const freq = getFrequency({token});

	const [
		totalJournals,
		averageWordCount,
		longestStreak,
		CategoryDistribution,
		wordCountTrend,
		wordCountByCategory,
		timeOfDayStats,
		frequency,
	] = await Promise.all([ttj, awc, lst, cdb, wct, wcbc, tods, freq]);

	console.log({averageWordCount});

	return (
		<div className='p-2 m-2'>
			<Summary
				totalJournals={totalJournals}
				averageWordCount={averageWordCount}
				longestStreak={longestStreak}
				categoriesDistribution={CategoryDistribution}
				wordCountTrend={wordCountTrend}
				wordCountByCategory={wordCountByCategory}
				timeOfDayStats={timeOfDayStats}
				frequency={frequency}
			/>
		</div>
	);
};

export default AnalyticsHome;
