'use client';

import { createContext, useState } from 'react';

export const DirectionContext = createContext<
    [-1 | 1, React.Dispatch<React.SetStateAction<-1 | 1>>]
>([-1, () => {}]);
export default function DirectionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [direction, setDirection] = useState<-1 | 1>(-1);

    return (
        <DirectionContext.Provider value={[direction, setDirection]}>
            {children}
        </DirectionContext.Provider>
    );
}
