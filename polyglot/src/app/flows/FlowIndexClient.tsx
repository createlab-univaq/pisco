'use client';

import { useMemo, useState } from 'react';
import FlowCard from '@/components/cards/FlowCard';
import CreateFlowModal from '@/components/modals/CreateFlowModal';
import DeleteFlowModal from '@/components/modals/DeleteFlowModal';
import Navbar from '@/components/navbars/NavBar';
import SearchBar from '@/components/searchbars/SearchBar';

import { FlowsAPI, useFlows } from '@/data/api';
import styles from './FlowIndexClient.module.css';

export default function FlowIndexClient() {
  const [selectedFlowId, setSelectedFlowId] = useState<string | undefined>();
  const [searchValue, setSearchValue] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const onCreateOpen = () => setIsCreateOpen(true);
  const onCreateClose = () => setIsCreateOpen(false);

  const params = new URLSearchParams();
  // Optional: If you only want to fetch the user's flows, uncomment the line below:
  // params.append('me', 'true');
  if (searchValue) params.append('q', searchValue);
  const queryString = params.toString() ? `?${params.toString()}` : '';

  const { flows, isLoading, mutateFlows } = useFlows(queryString);

  const suggestions = useMemo(() => {
    return Array.from(new Set(flows.map((flow) => flow.title)));
  }, [flows]);

  const deleteFlow = async (flowId: string) => {
    try {
      await FlowsAPI.delete(flowId);
      mutateFlows(flows.filter((flow) => flow._id !== flowId), false);
    } catch (error) {
      console.error('Failed to delete flow:', error);
    }
  };

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Learning Paths</h1>

        <SearchBar
          inputValue={searchValue}
          setInputValue={setSearchValue}
          items={suggestions}
          placeholder="Search learning paths..."
        />

        <div className={styles.contentArea}>
          {isLoading ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
              Loading learning paths...
            </p>
          ) : flows.length ? (
            <div className={styles.flowGrid}>
              {flows.map((flow) => (
                <FlowCard
                  key={flow._id}
                  flow={flow}
                  canDelete={true}
                  setSelected={setSelectedFlowId}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h2>You have 0 Learning paths available!</h2>
              <p>Create one with the + button ;)</p>
            </div>
          )}

          {/* Floating Action Button (FAB) */}
          <button
            className={styles.fab}
            onClick={onCreateOpen}
            title="Create Flow"
            aria-label="Create Flow"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.fabIcon}
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        <CreateFlowModal
          isOpen={isCreateOpen}
          onClose={onCreateClose}
        />

        {selectedFlowId && (
          <DeleteFlowModal
            isOpen={!!selectedFlowId}
            onClose={() => setSelectedFlowId(undefined)}
            deleteFunc={deleteFlow}
            flowId={selectedFlowId}
          />
        )}
      </div>
    </>
  );
}