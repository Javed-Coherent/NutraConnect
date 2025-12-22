import { getSubscriptionDataAction } from '@/lib/actions/subscription';
import { SubscriptionContent } from '@/components/dashboard/SubscriptionContent';

export default async function SubscriptionPage() {
  // Fetch subscription data from database
  const data = await getSubscriptionDataAction();

  return <SubscriptionContent data={data} />;
}
