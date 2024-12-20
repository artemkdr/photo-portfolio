import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

interface WindowSize {
    width: number;
    height: number;
}

const WindowSizeContext = createContext<WindowSize | undefined>(undefined);

export const WindowSizeProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <WindowSizeContext.Provider value={windowSize}>
            {children}
        </WindowSizeContext.Provider>
    );
};

export const useWindowSize = (): WindowSize => {
    const context = useContext(WindowSizeContext);
    if (context === undefined) {
        throw new Error(
            'useWindowSize must be used within a WindowSizeProvider'
        );
    }
    return context;
};
