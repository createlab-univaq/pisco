'use client';

import Image from 'next/image';
import Link from 'next/link';
import cardImage from '@public/test_card.png';
import styles from './FlowCard.module.css';
import { Flow } from '@/types';

type FlowCardProps = {
  flow: Flow;
  setSelected?: (flowId: string) => void;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

const FlowCard = ({ flow, setSelected }: FlowCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={cardImage}
          alt="Flow card"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.cardBody}>
          <button
            className={styles.deleteButton}
            title="Delete"
            aria-label="Delete Flow"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelected?.(flow.id);
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>

          <h2 className={styles.title}>
            <Link href={`/flows/${flow.id}`} className={styles.cardLink}>
              {flow.name}
            </Link>
          </h2>

          <p className={styles.description}>{flow.description}</p>
        </div>

        <div className={styles.cardFooter}>
          <p className={styles.metaText}>
            Created: <strong>{formatDate(flow.createdAt)}</strong>
          </p>

          <div className={styles.publishStatus}>
            <span className={styles.publishText}>
              {flow.published ? 'Published' : 'Not published'}:
            </span>
            <div className={`${styles.statusIcon} ${flow.published ? styles.statusGreen : styles.statusRed}`}>
              {flow.published ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowCard;

export function SkeletonFlowCards() {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonImage}></div>
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonText}></div>
        <div className={styles.skeletonTextShort}></div>
      </div>
    </div>
  );
}