// components/Container.tsx
import React from "react";

interface Props {
    children?: React.ReactNode;
}

export default function Container({ children }: Props) {
    return (
        <div className="mx-auto px-8 py-4 min-h-dvh @container">
            {children}
        </div>
    );
}
