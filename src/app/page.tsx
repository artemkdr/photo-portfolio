import { Content } from '@/app/content/content';
import { ThumbnailWall } from '@/app/ui/thumbnail-wall';

export default async function Home() {
    return (
        <main className="w-screen flex justify-center items-center p-8">
            <div className="flex flex-col max-w-[800px] gap-4">
                <h1 className="text-2xl font-bold">{Content.Common.Title}</h1>
                <div>
                    {Content.Home.Intro.map((text, index) => (
                        <p
                            key={index}
                            dangerouslySetInnerHTML={{ __html: text }}
                        />
                    ))}
                </div>
                <div className="mt-4 mb-4">
                    <ThumbnailWall />
                </div>
                <footer className="flex flex-col text-center gap-2">
                    <div className="flex flex-row justify-center gap-4">
                        {Content.Links.map((link) => (
                            <a
                                key={link.Url}
                                href={link.Url}
                                target="_blank"
                                title={Content.Common.Name + ' ' + link.Title}
                            >
                                {link.Title}
                            </a>
                        ))}
                    </div>
                    <div className="copyright">
                        {Content.Common.Copyright?.replace(
                            '{year}',
                            new Date().getFullYear().toString()
                        )}
                    </div>
                </footer>
            </div>
        </main>
    );
}
