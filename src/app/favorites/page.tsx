import { redirect } from 'next/navigation';

export default function DeprecatedFavoritesPage() {
  redirect('/app/favorites');
}
