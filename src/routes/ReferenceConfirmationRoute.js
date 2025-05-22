import React from 'react';
import { ReferenceConfirmation } from '../features/typing';

/**
 * Reference confirmation route component
 */
export default function ReferenceConfirmationRoute({ 
  selectedReference, 
  onBegin, 
  onBack, 
  easyMode, 
  onToggleEasyMode,
  ghostTextEnabled,
  onToggleGhostText,
  showReferenceEnabled,
  onToggleShowReference
}) {
  return (
    <ReferenceConfirmation
      selectedReference={selectedReference}
      onBegin={onBegin}
      onBack={onBack}
      easyMode={easyMode}
      onToggleEasyMode={onToggleEasyMode}
      ghostTextEnabled={ghostTextEnabled}
      onToggleGhostText={onToggleGhostText}
      showReferenceEnabled={showReferenceEnabled}
      onToggleShowReference={onToggleShowReference}
    />
  );
}