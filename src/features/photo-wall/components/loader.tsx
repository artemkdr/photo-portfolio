'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export default function Loader() {
    return (
        <div className="flex justify-center items-center text-center min-h-20">
            <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1, ease: 'easeOut' }}
            >
                <Image
                    src="/loading.gif"
                    alt="loading"
                    aria-busy="true"
                    width={400}
                    height={10}
                    unoptimized
                />
            </motion.div>
        </div>
    );
}
