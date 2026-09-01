'use client';

import React from 'react';
import styles from './Card.module.css';

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

const Card = ({
    className,
    children,
    ...rest
}: React.PropsWithChildren<CardProps>) => {
    return (
        <div
            className={`${styles.card} ${className ?? ''}`.trim()}
            {...rest}
        >
            {children}
        </div>
    );
};

export default Card;