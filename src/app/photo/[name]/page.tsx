import ModalImage from '@/app/ui/modal-image';

export default async function Page({
    params,
}: {
    params: Promise<{ name: string }>;
}) {
    const { name } = await params;
    return <ModalImage id={name} />;
}
