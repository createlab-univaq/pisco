'use client';

import Image from 'next/image';
import Link from 'next/link';
import cardImage from '@public/test_card.png';
import styles from './FlowCard.module.css';
import { PolyglotFlow } from '@/types/PolyglotFlow';

type FlowCardProps = {
  canDelete?: boolean;
  setSelected?: (flowId: string) => void;
  flow: PolyglotFlow;
};

const FlowCard = ({ flow, canDelete, setSelected }: FlowCardProps) => {
  return (
    <div className={styles.card}>
      
      <div className={styles.imageContainer}>
        <Image
          src={cardImage}
          alt="Flow card"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // FIXED: Added sizes prop
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.cardBody}>
          
          {canDelete && (
            <button
              className={styles.deleteButton}
              title="Delete"
              aria-label="Delete Flow"
              onClick={(e) => {
                e.preventDefault(); 
                e.stopPropagation();
                setSelected?.(flow._id!);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          )}

          <h2 className={styles.title}>
            <Link href={`/flows/${flow._id}`} className={styles.cardLink}>
              {flow.title}
            </Link>
          </h2>

          <p className={styles.description}>{flow.description}</p>
          
          <p className={styles.metaText}>
            In this Learning Path there are: <strong>{flow.nodes?.length || 0}</strong> learning activities
          </p>
        </div>

        <div className={styles.cardFooter}>
          
          <div className={styles.authorSection}>
            {!canDelete && flow.author?.username && (
              <>
                <span className={styles.authorName}>{flow.author.username}</span>
                <div className={styles.avatar}>
                  {flow.author.username.charAt(0).toUpperCase()}
                </div>
              </>
            )}
          </div>

          <div className={styles.publishStatus}>
            <span className={styles.publishText}>
              {flow.publish ? 'Published' : 'Not published'}:
            </span>
            <div className={`${styles.statusIcon} ${flow.publish ? styles.statusGreen : styles.statusRed}`}>
              {flow.publish ? (
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