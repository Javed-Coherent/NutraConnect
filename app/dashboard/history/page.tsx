import { getHistoryPageDataAction } from '@/lib/actions/history';
import { SearchHistoryList } from '@/components/dashboard/SearchHistoryList';

export default async function SearchHistoryPage() {
  // Fetch history data from database
  const data = await getHistoryPageDataAction();

  return (
    <SearchHistoryList
      initialSearches={data.searches}
      initialProfileViews={data.profileViews}
      initialContactReveals={data.contactReveals}
      userPlan={data.user?.plan || 'free'}
      contactsRevealed={data.user?.contactsRevealed || 0}
    />
  );
}
