import { getSavedCompaniesAction } from '@/lib/actions/companies';
import { SavedCompaniesList } from '@/components/dashboard/SavedCompaniesList';

export default async function SavedCompaniesPage() {
  // Fetch saved companies from database
  const savedCompanies = await getSavedCompaniesAction();

  return <SavedCompaniesList initialData={savedCompanies} />;
}
