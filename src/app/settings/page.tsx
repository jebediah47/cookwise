import { redirect } from 'next/navigation';

export default function DeprecatedSettingsPage() {
  redirect('/app/settings');
}
