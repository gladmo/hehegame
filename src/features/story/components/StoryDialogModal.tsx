import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMetaStore } from '@/store/useMetaStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { STORY_CHAPTERS } from '@/data/story';
import type { DialogLine } from '@/shared/types';

export function StoryDialogModal() {
    const currentModal = useMetaStore(state => state.currentModal);
    const setModal = useMetaStore(state => state.setModal);
    const storyChapter = usePlayerStore(state => state.storyChapter);
    const storyStep = usePlayerStore(state => state.storyStep);
    const setStoryProgress = usePlayerStore(state => state.setStoryProgress);

    const [currentDialogIndex, setCurrentDialogIndex] = useState(0);

    if (currentModal !== 'story') {
        return null;
    }

    const chapter = STORY_CHAPTERS.find(c => c.id === storyChapter);
    if (!chapter) {
        return null;
    }

    const currentDialog: DialogLine = chapter.dialogs[currentDialogIndex];
    if (!currentDialog) {
        return null;
    }

    const handleNext = () => {
        if (currentDialogIndex < chapter.dialogs.length - 1) {
            setCurrentDialogIndex(currentDialogIndex + 1);
        } else {
            // End of chapter
            setModal(null);
            setCurrentDialogIndex(0);
        }
    };

    const handleChoice = (nextStep: number) => {
        setStoryProgress(storyChapter, nextStep);
        setModal(null);
        setCurrentDialogIndex(0);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px',
                }}
                onClick={() => setModal(null)}
            >
                <motion.div
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 50 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '30px',
                        maxWidth: '600px',
                        width: '100%',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#333' }}>
                            {chapter.title}
                        </h2>
                        <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>
                            第 {currentDialogIndex + 1}/{chapter.dialogs.length} 对话
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        marginBottom: '24px',
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: '#ffb69f',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '30px',
                            flexShrink: 0,
                        }}>
                            {currentDialog.avatar === 'quinn' ? '👩‍🍳' :
                             currentDialog.avatar === 'chen' ? '👨‍🦳' :
                             currentDialog.avatar === 'narrator' ? '📖' :
                             currentDialog.avatar === 'mystery' ? '❓' :
                             '👤'}
                        </div>

                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#333' }}>
                                {currentDialog.speaker}
                            </h3>
                            <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.6', color: '#555' }}>
                                {currentDialog.text}
                            </p>
                        </div>
                    </div>

                    {currentDialog.choices ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {currentDialog.choices.map((choice, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleChoice(choice.nextStep)}
                                    style={{
                                        padding: '12px 20px',
                                        background: '#ffb69f',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#ff9f7f';
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#ffb69f';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    {choice.text}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                            <button
                                onClick={() => setModal(null)}
                                style={{
                                    padding: '12px 24px',
                                    background: '#ddd',
                                    color: '#333',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                }}
                            >
                                跳过
                            </button>
                            <button
                                onClick={handleNext}
                                style={{
                                    padding: '12px 24px',
                                    background: '#ffb69f',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                }}
                            >
                                {currentDialogIndex < chapter.dialogs.length - 1 ? '继续' : '完成'}
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
