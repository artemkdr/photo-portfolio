import ModalImage from '@/app/ui/modal-image';
const InterceptedRoute = async ({ params }: { params: { name: string } }) => {
    const { name } = await params;
    return <ModalImage id={name} />;
};
export default InterceptedRoute;
