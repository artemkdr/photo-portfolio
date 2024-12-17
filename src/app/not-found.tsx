import { Content } from '@/content/content';
import Link from 'next/link';

export default async function NotFound() {
    return (
        <main className="w-[100%] h-[100vh] flex justify-center items-center p-8 flex-col">
            <div>{Content.Errors.NotFound}</div>
            <Link href="/">{Content.Common.Return}</Link>
        </main>
    );
}
