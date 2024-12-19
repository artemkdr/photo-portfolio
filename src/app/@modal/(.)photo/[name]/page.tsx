import { appConfig } from '@/app.config';
import { Content } from '@/content/content';
import ModalImage from '@/features/photo-wall/components/modal-image';

const InterceptedRoute = async ({
    params,
}: {
    params: Promise<{ name: string }>;
}) => {
    const { name } = await params;
    return (
        <ModalImage
            id={name}
            footer={
                <div
                    className="bg-black/80 p-2 text-nowrap absolute bottom-0 left-1/2 -translate-x-1/2 text-gray-400 z-10 font-thin"
                    dangerouslySetInnerHTML={{
                        __html: Content.Photo.Footer.replace(
                            '{subject}',
                            encodeURIComponent(
                                `/${appConfig.photosPath}/${name}`
                            )
                        ).replace('{email}', Content.Common.Email),
                    }}
                />
            }
        />
    );
};
export default InterceptedRoute;
