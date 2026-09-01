import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiFetch } from '@/lib/server/apiClient';
import { REGISTER_PATH } from '@/lib/server/api-paths';
import Navbar from '@/components/navbars/NavBar';
import { Analyst } from '@/types';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) redirect('/login');

    const res = await apiFetch(`${REGISTER_PATH}/${userId}`);
    if (!res.ok) redirect('/login');

    const analyst: Analyst = await res.json();

    return (
        <>
            <Navbar />
            <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                <ProfileClient analyst={analyst} />
            </main>
        </>
    );
}