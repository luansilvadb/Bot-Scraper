import React from 'react';
import './ViewTransition.css';

interface ViewTransitionProps {
    /** Currently active view identifier */
    activeView: 'status' | 'config';

    /** Two children: [StatusView, ConfigView] */
    children: [React.ReactNode, React.ReactNode];

    /** Callback when transition completes */
    onTransitionEnd?: () => void;
}

/**
 * ViewTransition - Animated wrapper for view switching
 * 
 * Provides smooth slide transitions between Status and Config views.
 * Uses CSS transforms for GPU-accelerated 60fps animations.
 */
const ViewTransition: React.FC<ViewTransitionProps> = ({
    activeView,
    children,
    onTransitionEnd
}) => {
    const [statusView, configView] = children;

    const handleTransitionEnd = (e: React.TransitionEvent) => {
        // Only fire callback when the transform transition ends on the active view
        if (e.propertyName === 'transform' || e.propertyName === 'opacity') {
            onTransitionEnd?.();
        }
    };

    return (
        <div className="view-transition-container">
            <div
                className={`view-panel ${activeView === 'status' ? 'active' : 'inactive-left'}`}
                onTransitionEnd={activeView === 'status' ? handleTransitionEnd : undefined}
            >
                {statusView}
            </div>
            <div
                className={`view-panel ${activeView === 'config' ? 'active' : 'inactive-right'}`}
                onTransitionEnd={activeView === 'config' ? handleTransitionEnd : undefined}
            >
                {configView}
            </div>
        </div>
    );
};

export default ViewTransition;
