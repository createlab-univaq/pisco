'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FlowsAPI } from '../../data/api'; // Adjust path if needed based on your folder structure
import styles from './CreateFlowModal.module.css';
import { PolyglotFlow } from '@/types/polyglot-elements/PolyglotFlow';
import { PolyglotFlowInfo } from '@/types/polyglot-elements/PolyglotFlowInfo';
import { Editor } from '@monaco-editor/react';

// We removed the API prop since we import FlowsAPI directly now!
type CreateFlowModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const colorMap: Record<string, string> = {
  gray: '#cbd5e0',
  yellow: '#faf089',
  orange: '#f6ad55',
  red: '#fc8181',
  pink: '#f687b3',
  purple: '#b794f4',
  blue: '#63b3ed',
  cyan: '#76e4f7',
  teal: '#4fd1c5',
  green: '#68d391',
};
export const colors = Object.keys(colorMap);

const CreateFlowModal = ({ isOpen, onClose }: CreateFlowModalProps) => {
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState(0);
  const [flow, setFlow] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [tagName, setTagName] = useState('');
  const [colorTag, setColorTag] = useState(colors[0]);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [tags, setTags] = useState<{ name: string; color: string }[]>([]);

  // Reset on reopen
  useEffect(() => {
    if (!isOpen) return;
    setCurrentTab(0);
    setFlow(undefined);
    setLoading(false);
    setErrorMessage(null);
    setTitle('');
    setDescription('');
    setColorTag(colors[0]);
    setTags([]);
    setTagName('');
    setIsColorPickerOpen(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const normalizedTagName = tagName.trim().toUpperCase();

  const addTag = () => {
    if (!normalizedTagName) return;
    setTags((prev) => {
      const exists = prev.some((t) => t.name === normalizedTagName);
      if (exists) return prev;
      return [...prev, { name: normalizedTagName, color: colorTag }];
    });
    setTagName('');
  };

  const removeTagAt = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const createFlow = async () => {
    try {
      setErrorMessage(null);
      setLoading(true);
      
      let createdFlow: PolyglotFlow;

      switch (currentTab) {
        case 0: {
          const base_Flow: PolyglotFlowInfo = {
            title: title.trim(),
            description: description.trim(),
            tags,
            publish: false,
          };
          // Call our new native fetch API
          createdFlow = await FlowsAPI.create(base_Flow);
          break;
        }
        case 1: {
          if (!flow) {
            setLoading(false);
            return;
          }
          const poly_flow: PolyglotFlow = JSON.parse(flow);
          createdFlow = await FlowsAPI.createFromJson(poly_flow);
          break;
        }
        default:
          setLoading(false);
          return;
      }

      if (!createdFlow || !createdFlow._id) {
        setErrorMessage('Something went wrong. Flow was not created.');
        return;
      }

      // Native fetch returns the direct object, so we access _id directly!
      router.push('/flows/' + createdFlow._id);
      
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        setErrorMessage(`Invalid JSON syntax: ${error.message}`);
      } else {
        console.error(error);
        setErrorMessage(error.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const canCreateCustom = title.trim().length > 0 && description.trim().length > 0;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        
        <div className={styles.modalHeader}>
          <h2>Create Flow</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.tabList}>
            <button 
              className={currentTab === 0 ? styles.activeTab : styles.tab} 
              onClick={() => setCurrentTab(0)}
            >
              Custom
            </button>
            <button 
              className={currentTab === 1 ? styles.activeTab : styles.tab} 
              onClick={() => setCurrentTab(1)}
            >
              Import JSON
            </button>
          </div>

          <div className={styles.tabPanels}>
            {/* TAB 0: Custom */}
            {currentTab === 0 && (
              <div className={styles.formControl}>
                <label className={styles.label}>Title:</label>
                <input
                  className={styles.input}
                  placeholder="Insert title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <label className={styles.label}>Description:</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Insert description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <label className={styles.label}>Tags:</label>
                <div className={styles.tagInputRow}>
                  
                  {/* Custom Color Picker Popover */}
                  <div className={styles.colorPickerContainer}>
                    <button
                      className={styles.colorTrigger}
                      style={{ backgroundColor: colorMap[colorTag] }}
                      onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                      title="Select Color"
                    />
                    {isColorPickerOpen && (
                      <div className={styles.colorPopover}>
                        <div className={styles.colorGrid}>
                          {colors.map((c) => (
                            <button
                              key={c}
                              className={styles.colorOption}
                              style={{ backgroundColor: colorMap[c] }}
                              onClick={() => {
                                setColorTag(c);
                                setIsColorPickerOpen(false);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    className={styles.input}
                    placeholder="Insert tag name (Press Enter↵)..."
                    value={tagName}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    onChange={(e) => setTagName(e.target.value)}
                  />

                  <button 
                    className={styles.iconButton} 
                    disabled={!normalizedTagName} 
                    onClick={addTag}
                  >
                    +
                  </button>
                </div>

                {/* Render Selected Tags */}
                <div className={styles.tagsContainer}>
                  {tags.map((tag, id) => (
                    <button
                      key={`${tag.name}-${id}`}
                      className={styles.tagBadge}
                      style={{ backgroundColor: colorMap[tag.color] }}
                      onClick={() => removeTagAt(id)}
                      title="Click to remove"
                    >
                      <span>&times;</span> {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 1: Import JSON */}
            {currentTab === 1 && (
              <div className={styles.editorContainer}>
                <Editor
                  height="400px"
                  language="json"
                  value={flow}
                  onChange={(value) => setFlow(value)}
                  options={{ minimap: { enabled: false } }}
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