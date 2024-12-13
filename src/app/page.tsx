import { ThumbnailWall } from '@/app/ui/thumbnail-wall';

export default async function Home() {
    return (
        <div className="w-screen flex justify-center items-center p-8">
            <div className="flex flex-col max-w-[800px] gap-4">
                <h1 className="text-2xl font-bold">
                    Artem Kudryavtsev&apos;s photos
                </h1>
                <p>
                    Hi, my name is Artem Kudryavtsev, I&apos;m a photographer
                    based in Switzerland.
                    <br />
                    Here you&apos;ll find a collection of my best work capturing
                    moments and scenes from around the world.
                    <br />
                    These photos were taken with digital cameras (Sony a6000,
                    Sony A7III), mobile phone camera (Google Pixel), action
                    camera (GoPro 10), film camera (Olympus XA) and a drone (DJI
                    Spark).
                    <br />
                    Don&apos;t hesitate to{' '}
                    <a href="mailto:artem.kdr@gmail.com">contact me</a> for any
                    inquiries or collaborations concerning photography.
                </p>
                <div className="mt-4 mb-4">
                    <ThumbnailWall />
                </div>
                <footer className="flex flex-col text-center gap-2">
                    <div className="flex flex-row justify-center gap-4">
                        <a
                            href="mailto:artem.kdr@gmail.com"
                            target="_blank"
                            title="Artem Kudryavtsev Email"
                        >
                            Email
                        </a>
                        <a
                            href="https://github.com/artemkdr"
                            target="_blank"
                            title="Artem Kudryavtsev GitHub"
                        >
                            GitHub
                        </a>
                        <a
                            href="https://instagram.com/artem.kdr"
                            target="_blank"
                            title="Artem Kudryavtsev Instagram"
                        >
                            Instagram
                        </a>
                        <a
                            href="https://www.linkedin.com/in/artem-kudryavtsev-8937144/"
                            target="_blank"
                            title="Artem Kudryavtsev Linkedin"
                        >
                            LinkedIn
                        </a>
                    </div>
                    <div className="copyright">
                        All rights reserved © {new Date().getFullYear()}.
                        Please do not use photos without my permission.
                    </div>
                </footer>
            </div>
        </div>
    );
}
