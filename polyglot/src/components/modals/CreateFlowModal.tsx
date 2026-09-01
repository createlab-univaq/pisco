'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './CreateFlowModal.module.css';
import { Editor } from '@monaco-editor/react';
import { createFlowAction } from '@/lib/actions/flows';
import { createNewDefaultPolyglotFlow } from '@/lib/factories/polyglotGenerators';

type CreateFlowModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateFlowModal = ({ isOpen, onClose }: CreateFlowModalProps) => {
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState(0);
  const [jsonInput, setJsonInput] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Reset on reopen
  useEffect(() => {
    if (!isOpen) return;
    setCurrentTab(0);
    setJsonInput(undefined);
    setLoading(false);
    setErrorMessage(null);
    setName('');
    setDescription('');
  }, [isOpen]);

  if (!isOpen) return null;

  const createFlow = async () => {
    try {
      setErrorMessage(null);
      setLoading(true);

      let result;

      switch (currentTab) {
        // TAB 0: Custom Flow (Initialized with default generator nodes/edges)
        case 0: {
          const defaultFlow = createNewDefaultPolyglotFlow();
          result = await createFlowAction({
            name: name.trim(),
            description: description.trim(),
            flowJson: defaultFlow.flowJson, // Ensures { nodes: [], edges: [] }
          });
          break;
        }
        // TAB 1: Import JSON
        case 1: {
          if (!jsonInput) {
            setErrorMessage('Please provide valid JSON.');
            setLoading(false);
            return;
          }

          const parsedData = JSON.parse(jsonInput);
          const flowJsonData = parsedData.flowJson || (parsedData.nodes ? parsedData : { nodes: [], edges: [] });

          result = await createFlowAction({
            name: parsedData.name || 'Imported Flow',
            description: parsedData.description || '',
            flowJson: flowJsonData,
          });
          break;
        }
        default:
          setLoading(false);
          return;
      }

      if (result.error) {
        setErrorMessage(result.error);
        return;
      }

      if (result.success && result.flow?.id) {
        onClose();
        router.push(`/flows/${result.flow.id}`);
      }

    } catch (error: any) {
      if (error instanceof SyntaxError) {
        setErrorMessage(`Invalid JSON syntax: ${error.message}`);
      } else {
        setErrorMessage(error.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const canCreateCustom = name.trim().length > 0 && description.trim().length > 0;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>

        <div className={styles.modalHeader}>
          <h2>Create Flow</h2>
          <button className={styles.closeButton} onClick={onClose} disabled={loading}>&times;</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.tabList}>
            <button
              className={currentTab === 0 ? styles.activeTab : styles.tab}
              onClick={() => setCurrentTab(0)}
              disabled={loading}
            >
              Custom
            </button>
            <button
              className={currentTab === 1 ? styles.activeTab : styles.tab}
              onClick={() => setCurrentTab(1)}
              disabled={loading}
            >
              Import JSON
            </button>
          </div>

          <div className={styles.tabPanels}>
            {/* TAB 0: Custom */}
            {currentTab === 0 && (
              <div className={styles.formControl}>
                <label className={styles.label}>Name:</label>
                <input
                  className={styles.input}
                  placeholder="Insert name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />

                <label className={styles.label}>Description:</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Insert description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            {/* TAB 1: Import JSON */}
            {currentTab === 1 && (
              <div className={styles.editorContainer}>
                <Editor
                  height="400px"
                  language="json"
                  value={jsonInput}
                  onChange={(value) => setJsonInput(value)}
                  options={{ minimap: { enabled: false }, readOnly: loading }}
                />
              </div>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className={styles.errorMessage}>
            {errorMessage}
          </div>
        )}

        <div className={styles.modalFooter}>
          <button
            className={styles.submitButton}
            onClick={createFlow}
            disabled={loading || (currentTab === 0 ? !canCreateCustom : false)}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateFlowModal;