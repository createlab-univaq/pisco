'use client';

import { useMemo, useState } from 'react';
import FlowCard from '@/components/cards/FlowCard';
import CreateFlowModal from '@/components/modals/CreateFlowModal';
import DeleteFlowModal from '@/components/modals/DeleteFlowModal';
import Navbar from '@/components/navbars/NavBar';
import SearchBar from '@/components/searchbars/SearchBar';

// Import the custom hook and API helper we created in data/api.ts
import { FlowsAPI, useFlows } from '@/data/api'; 
import styles from './FlowIndexClient.module.css';

export default function FlowIndexClient() {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedFlowId, setSelectedFlowId] = useState<string | undefined>();
  const [searchValue, setSearchValue] = useState('');
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const onCreateOpen = () => setIsCreateOpen(true);
  const onCreateClose = () => setIsCreateOpen(false);

  // 1. Build the query string dynamically
  const params = new URLSearchParams();
  if (currentTab === 0) params.append('me', 'true');
  if (searchValue) params.append('q', searchValue);
  const queryString = params.toString() ? `?${params.toString()}` : '';

  // 2. Use our SWR custom hook to automatically fetch, cache, and load data!
  const { flows, isLoading, mutateFlows } = useFlows(queryString);

  // 3. Automatically derive search suggestions from the fetched flows
  const suggestions = useMemo(() => {
    return Array.from(new Set(flows.map((flow) => flow.title)));
  }, [flows]);

  // 4. Use the API helper for deleting, then instantly update the cache
  const deleteFlow = async (flowId: string) => {
    try {
      await FlowsAPI.delete(flowId);
      // mutateFlows updates the UI instantly without needing a full page reload
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

        <div className={styles.tabsContainer}>
          {/* Custom Tab List */}
          <div className={styles.tabList}>
            <button
              className={currentTab === 0 ? styles.activeTab : styles.tab}
              onClick={() => setCurrentTab(0)}
            >
              My Learning Paths: {flows.length}
            </button>
            <button
              className={currentTab === 1 ? styles.activeTab : styles.tab}
              onClick={() => setCurrentTab(1)}
            >
              All
            </button>
          </div>

          {/* Tab Panels */}
          <div className={styles.tabPanels}>
            {/* Show a loading state gracefully */}
            {isLoading ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
                Loading learning paths...
              </p>
            ) : (
              <>
                {/* TAB 1: My Learning Paths */}
                {currentTab === 0 && (
                  <div className={styles.tabPanel}>
                    {flows.length ? (
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
                )}

                {/* TAB 2: All Learning Paths */}
                {currentTab === 1 && (
                  <div className={styles.tabPanel}>
                    {flows.length ? (
                      <div className={styles.flowGrid}>
                        {flows.map((flow) => (
                          <FlowCard key={flow._id} flow={flow} />
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyState}>
                        <h2>No flows found!</h2>
                        <p>Search something different ;)</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Notice we removed the `API={API}` prop because CreateFlowModal imports it directly now! */}
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